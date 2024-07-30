import fs from "fs";
import * as status from "../../constants/httpStatusCodes";
import readline from "readline";

import db from "../../database/models";

const { Tweet, User, Hashtag, sequelize } = db;

export default class ETLController {
  /**
   * @description Perform ETL process
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} ETL process status
   */
  static async performETL(req, res) {
    const { filePath } = req.body;

    // const filePath = path.resolve(__dirname, "../../json/data.json");

    // if (!fs.existsSync(filePath)) {
    //   return res.status(400).json({ error: "File not found" });
    // }

    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const result = await ETLController.processFile(filePath);

    return res.status(status.HTTP_OK).json({
      status: status.HTTP_OK,
      result,
    });
  }

  static async processFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let batchTweets = [];
    let batchUsers = [];
    let batchHashtags = [];
    const batchSize = 100;
    let processedCount = 0;
    let errorCount = 0;

    for await (const line of rl) {
      try {
        const tweet = JSON.parse(line);

        if (ETLController.isValidTweet(tweet)) {
          batchTweets.push(ETLController.extractTweetData(tweet));
          batchUsers.push(ETLController.extractUserData(tweet.user));
          batchHashtags = batchHashtags.concat(
            ETLController.extractHashtags(tweet)
          );

          if (batchTweets.length >= batchSize) {
            await ETLController.saveBatchWithRetry(
              batchTweets,
              batchUsers,
              batchHashtags
            );
            processedCount += batchTweets.length;
            console.log(`Processed ${processedCount} tweets`);
            batchTweets = [];
            batchUsers = [];
            batchHashtags = [];
          }
        }
      } catch (error) {
        console.error("Error processing tweet::", error);
        errorCount++;
      }
    }

    // Save any remaining data
    if (batchTweets.length > 0) {
      await ETLController.saveBatchWithRetry(
        batchTweets,
        batchUsers,
        batchHashtags
      );
      processedCount += batchTweets.length;
    }

    return {
      message: "ETL process completed",
      processedCount,
      errorCount,
    };
  }

  static isValidTweet(tweet) {
    return (
      tweet.id_str &&
      tweet.user &&
      tweet.user.id_str &&
      tweet.text &&
      tweet.created_at &&
      tweet.lang
    );
  }

  static extractTweetData(tweet) {
    return {
      id_str: tweet.id_str,
      text: tweet.text,
      created_at: new Date(tweet.created_at),
      lang: tweet.lang,
      retweet_count: tweet.retweet_count || 0,
      favorite_count: tweet.favorite_count || 0,
      possibly_sensitive: tweet.possibly_sensitive || false,
      filter_level: tweet.filter_level || "low",
      user_id: tweet.user.id_str,
      in_reply_to_status_id_str: tweet.in_reply_to_status_id_str || null,
      in_reply_to_user_id_str: tweet.in_reply_to_user_id_str || null,
    };
  }

  static extractUserData(user) {
    return {
      id_str: user.id_str,
      name: user.name,
      screen_name: user.screen_name,
      location: user.location,
      description: user.description,
      followers_count: user.followers_count,
      friends_count: user.friends_count,
      listed_count: user.listed_count,
      favourites_count: user.favourites_count,
      statuses_count: user.statuses_count,
      created_at: new Date(user.created_at),
      lang: user.lang,
    };
  }

  static extractHashtags(tweet) {
    return tweet.entities.hashtags.map((hashtag) => ({
      text: hashtag.text.toLowerCase(),
    }));
  }

  static async saveBatchWithRetry(tweets, users, hashtags, retries = 3) {
    try {
      await ETLController.saveBatch(tweets, users, hashtags);
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying save batch. Attempts left: ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        await ETLController.saveBatchWithRetry(
          tweets,
          users,
          hashtags,
          retries - 1
        );
      } else {
        throw error;
      }
    }
  }

  static async saveBatch(tweets, users, hashtags) {
    const transaction = await sequelize.transaction();

    try {
      await User.bulkCreate(users, {
        updateOnDuplicate: [
          "name",
          "screen_name",
          "location",
          "description",
          "followers_count",
          "friends_count",
          "listed_count",
          "favourites_count",
          "statuses_count",
          "lang",
        ],
        transaction,
      });

      await Tweet.bulkCreate(tweets, {
        updateOnDuplicate: [
          "text",
          "retweet_count",
          "favorite_count",
          "possibly_sensitive",
          "filter_level",
        ],
        transaction,
      });

      await Hashtag.bulkCreate(hashtags, {
        ignoreDuplicates: true,
        transaction,
      });

      const hashtagAssociations = tweets.flatMap((tweet, index) =>
        hashtags.slice(index * 8, (index + 1) * 8).map((hashtag) => ({
          TweetId_str: tweet.id_str,
          HashtagText: hashtag.text,
        }))
      );

      await sequelize.models.TweetHashtags.bulkCreate(hashtagAssociations, {
        ignoreDuplicates: true,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

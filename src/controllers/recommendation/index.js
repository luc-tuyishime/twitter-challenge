import * as status from "../../constants/httpStatusCodes";
import * as errorMessages from "../../constants/errorMessages";

import db from "../../database/models";

const { Op } = require("sequelize");
const { Hashtag, User, Tweet } = db;

export default class HashtagController {
  /**
   * @description Get user recommendations
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} Recommended users and their scores
   */
  static async getRecommendations(req, res) {
    const { user_id, type, phrase, hashtag } = req.query;

    // 1. Fetch all users who have interacted with the queried user
    const interactingUsers = await User.findAll({
      include: [
        {
          model: Tweet,
          as: "tweets",
          where: {
            [Op.or]: [
              { inReplyToUserId: user_id },
              { "$Tweet.retweetedStatus.userId$": user_id },
            ],
          },
          include: [
            { model: Hashtag },
            { model: Tweet, as: "retweetedStatus" },
          ],
        },
      ],
      where: {
        id: { [Op.ne]: user_id },
      },
    });

    // 2. Calculate scores for each interacting user
    const scoredUsers = await Promise.all(
      interactingUsers.map(async (user) => {
        const interactionScore =
          RecommendationController.calculateInteractionScore(
            user.tweets,
            user_id
          );
        const hashtagScore =
          await RecommendationController.calculateHashtagScore(
            user.id,
            user_id
          );
        const keywordsScore = RecommendationController.calculateKeywordsScore(
          user.tweets,
          type,
          phrase,
          hashtag
        );

        const finalScore = interactionScore * hashtagScore * keywordsScore;

        return {
          user,
          finalScore,
          latestContactTweet: RecommendationController.getLatestContactTweet(
            user.tweets,
            type
          ),
        };
      })
    );

    // 3. Sort users by final score and format response
    const sortedUsers = scoredUsers
      .filter(({ finalScore }) => finalScore > 0)
      .sort(
        (a, b) =>
          b.finalScore - a.finalScore || b.user.id.localeCompare(a.user.id)
      );

    const response = sortedUsers.map(({ user, latestContactTweet }) => ({
      user_id: user.id,
      screen_name: user.screenName,
      description: user.description,
      contact_tweet_text: latestContactTweet.text,
    }));

    return response.length
      ? res.status(status.HTTP_OK).json({
          status: status.HTTP_OK,
          recommendations: response,
        })
      : res.status(status.HTTP_NO_CONTENT).json({
          errors: { recommendations: errorMessages.RECOMMENDATIONS_NOT_FOUND },
        });
  }

  static calculateInteractionScore(tweets, queryUserId) {
    const replyCount = tweets.filter(
      (t) => t.inReplyToUserId === queryUserId
    ).length;
    const retweetCount = tweets.filter(
      (t) => t.retweetedStatus && t.retweetedStatus.userId === queryUserId
    ).length;
    return Math.log(1 + 2 * replyCount + retweetCount);
  }

  static async calculateHashtagScore(userId1, userId2) {
    const commonHashtags = await Hashtag.findAll({
      include: [
        { model: Tweet, where: { userId: userId1 } },
        { model: Tweet, where: { userId: userId2 } },
      ],
    });

    const sameTagCount = commonHashtags.length;
    return sameTagCount > 10 ? 1 + Math.log(1 + sameTagCount - 10) : 1;
  }

  static calculateKeywordsScore(tweets, type, phrase, hashtag) {
    const relevantTweets = tweets.filter((tweet) => {
      if (type === "reply" && !tweet.inReplyToUserId) return false;
      if (type === "retweet" && !tweet.retweetedStatus) return false;
      return true;
    });

    const matchCount = relevantTweets.reduce((count, tweet) => {
      const phraseMatches = (tweet.text.match(new RegExp(phrase, "g")) || [])
        .length;
      const hashtagMatches = tweet.hashtags.filter(
        (h) => h.text.toLowerCase() === hashtag.toLowerCase()
      ).length;
      return count + phraseMatches + hashtagMatches;
    }, 0);

    return matchCount > 0 ? 1 + Math.log(matchCount + 1) : 0;
  }

  static getLatestContactTweet(tweets, type) {
    const relevantTweets = tweets.filter((tweet) => {
      if (type === "reply") return tweet.inReplyToUserId;
      if (type === "retweet") return tweet.retweetedStatus;
      return tweet.inReplyToUserId || tweet.retweetedStatus;
    });

    return relevantTweets.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  }
}

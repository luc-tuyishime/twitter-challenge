"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Tweet.belongsTo(models.Tweet, {
        foreignKey: "in_reply_to_status_id_str",
        as: "inReplyToStatus",
      });
      Tweet.belongsToMany(models.Hashtag, { through: "TweetHashtags" });
    }
  }
  Tweet.init(
    {
      id_str: {
        type: new DataTypes.STRING(),
        primaryKey: true,
      },
      text: {
        type: new DataTypes.STRING(),
      },
      userId: {
        type: new DataTypes.STRING(),
      },
      lang: {
        type: new DataTypes.STRING(),
      },
      retweet_count: {
        type: new DataTypes.INTEGER(),
      },
      possibly_sensitive: {
        type: new DataTypes.BOOLEAN(),
      },
      filter_level: {
        type: new DataTypes.BOOLEAN(),
      },

      createdAt: {
        allowNull: false,
        type: new DataTypes.DATE(),
      },
      updatedAt: {
        allowNull: false,
        type: new DataTypes.DATE(),
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "Tweet",
      tableName: "tweets",
    }
  );
  return Tweet;
};

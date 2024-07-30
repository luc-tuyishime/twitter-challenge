"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize) => {
  class Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hashtag.belongsToMany(models.Tweet, { through: "TweetHashtags" });
    }
  }
  Hashtag.init(
    {
      text: {
        type: new DataTypes.STRING(),
        primaryKey: true,
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
      modelName: "Hashtag",
      tableName: "hashtags",
    }
  );
  return Hashtag;
};

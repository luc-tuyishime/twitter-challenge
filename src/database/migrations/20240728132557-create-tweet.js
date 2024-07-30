"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tweets", {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tweets");
  },
};

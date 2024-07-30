"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id_str: {
        type: new DataTypes.STRING(),
        primaryKey: true,
      },
      screen_name: {
        type: new DataTypes.STRING(),
      },
      name: {
        type: new DataTypes.STRING(),
      },

      description: {
        type: new DataTypes.TEXT(),
      },
      location: {
        type: new DataTypes.STRING(),
      },
      followers_count: {
        type: new DataTypes.INTEGER(),
      },
      friends_count: {
        type: new DataTypes.INTEGER(),
      },
      listed_count: {
        type: new DataTypes.INTEGER(),
      },
      favourites_count: {
        type: new DataTypes.INTEGER(),
      },
      statuses_count: {
        type: new DataTypes.INTEGER(),
      },
      lang: {
        type: new DataTypes.STRING(),
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
    await queryInterface.dropTable("users");
  },
};

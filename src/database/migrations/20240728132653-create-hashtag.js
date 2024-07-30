"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hashtags", {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("hashtags");
  },
};

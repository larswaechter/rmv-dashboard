"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Settings", [
      {
        key: "TELEGRAM_KEY",
        value: null,
        default: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "TELEGRAM_CHAT_ID",
        value: null,
        default: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Settings", null, {});
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Settings", [
      {
        key: "TELEGRAM_KEY",
        value: null,
        default: null,
        description: "Telegram API Key",
        group: "telegram",
        hidden: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "TELEGRAM_CHAT_ID",
        value: null,
        default: null,
        description: "Telegram Chat ID",
        group: "telegram",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "DISCORD_KEY",
        value: null,
        default: null,
        description: "Discord API Key",
        group: "discord",
        hidden: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "DISCORD_CHANNEL_ID",
        value: null,
        default: null,
        description: "Discord Channel ID",
        group: "discord",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Settings", null, {});
  },
};

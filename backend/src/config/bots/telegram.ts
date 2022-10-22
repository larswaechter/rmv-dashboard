import NodeTelegramBot from "node-telegram-bot-api";

import Logger from "../logger";
import { getSettingValue, Settings } from "../settings";

export class TelegramBot {
  private bot: NodeTelegramBot;
  private static readonly botName = "TelegramBot";

  static async of(): Promise<TelegramBot | undefined> {
    Logger.debug(`[${TelegramBot.botName}] Getting instance`);

    const key = await getSettingValue(Settings.TELEGRAM_KEY);
    if (!key) return undefined;

    return new TelegramBot(new NodeTelegramBot(key));
  }

  constructor(bot: NodeTelegramBot) {
    this.bot = bot;
  }

  getChatID() {
    return getSettingValue(Settings.TELEGRAM_CHAT_ID);
  }

  async sendMessage(message: string) {
    Logger.info(`[${TelegramBot.botName}] Sending Message`);
    const chatID = await this.getChatID();
    if (chatID) this.bot.sendMessage(chatID, message);
  }
}

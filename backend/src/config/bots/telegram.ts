import NodeTelegramBot from "node-telegram-bot-api";

import { IScheduleChange } from "../../services/cronjob";

import { IBot } from ".";
import Logger from "../logger";
import { getSettingValue, Settings } from "../settings";

export class TelegramBot implements IBot {
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

  async sendDelayNotifications(scheduleChanges: IScheduleChange[]) {
    let res = "";

    for (const not of scheduleChanges) {
      res += not.stop.buildDeviationMessages().join("\n-");
    }

    // await this.sendMessage(res);
  }
}

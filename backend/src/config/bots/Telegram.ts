import NodeTelegramBot from 'node-telegram-bot-api';

import { IScheduleChange } from '../../services/cronjob';

import { IBot } from '.';
import Logger from '../logger';
import { getSettingValue, Settings } from '../settings';

export class TelegramBot implements IBot {
  private bot: NodeTelegramBot;
  private static readonly botName = 'TelegramBot';

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
    if (chatID)
      this.bot.sendMessage(chatID, message, {
        parse_mode: 'HTML'
      });
  }

  async sendDelayNotifications(scheduleChanges: IScheduleChange[]) {
    if (!scheduleChanges.length) return;

    let res = `There are <b>${scheduleChanges.length}</b> schedule changes\n\n`;
    for (const notification of scheduleChanges) {
      res += `<u>Direction: ${notification.direction.value} (${notification.product.name})</u>\n`;
      res += `- Stop: ${notification.stop.name}\n`;
      res += '- ' + notification.stop.buildDeviationMessagesShort().join('\n- ');
      res += '\n\n';
    }

    await this.sendMessage(res);
  }
}

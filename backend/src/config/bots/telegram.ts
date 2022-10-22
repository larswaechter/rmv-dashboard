import NodeTelegramBot from "node-telegram-bot-api";

import Cache from "../cache";
import Logger from "../logger";
import { Settings } from "../settings";
import SettingsModel from "../../components/settings/model";

export const getTelegramBot = async () => {
  if (Cache.has(Settings.TELEGRAM_KEY))
    return new NodeTelegramBot(Cache.get(Settings.TELEGRAM_KEY));

  const setting = await SettingsModel.findOne({
    where: {
      key: Settings.TELEGRAM_KEY,
    },
  });

  if (!setting) {
    throw new Error(
      `[TelegramBot] Missing setting entry: ${Settings.TELEGRAM_KEY}`
    );
  }

  const key = setting.getDataValue("value");
  if (!key) {
    return undefined;
  }

  return new NodeTelegramBot(key);
};

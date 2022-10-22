import NodeTelegramBot from "node-telegram-bot-api";

import Cache from "../cache";
import { getSettingValue, Settings } from "../settings";

export const getTelegramBot = async () => {
  if (Cache.has(Settings.TELEGRAM_KEY))
    return new NodeTelegramBot(Cache.get(Settings.TELEGRAM_KEY));

  const key = await getSettingValue(Settings.TELEGRAM_KEY);

  if (!key) {
    return undefined;
  }

  return new NodeTelegramBot(key);
};

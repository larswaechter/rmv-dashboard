import SettingsModel from "../components/settings/model";
import Cache from "./cache";
import Logger from "./logger";

export enum Settings {
  TELEGRAM_KEY = "TELEGRAM_KEY",
  TELEGRAM_CHAT_ID = "TELEGRAM_CHAT_ID",
  DISCORD_KEY = "DISCORD_KEY",
  DISCORD_CHANNEL_ID = "DISCORD_CHANNEL_ID",
}

export const getSettingValue = async (key: Settings) => {
  if (Cache.has(key)) return Cache.get(key);

  const setting = await SettingsModel.findOne({
    where: {
      key,
    },
  });

  if (setting) {
    const value = setting.getDataValue("value");
    Cache.set(key, value);
    return value;
  }

  Logger.error(`Setting not found: ${key}`);

  return undefined;
};

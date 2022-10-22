import {
  Client,
  GatewayIntentBits,
  ChannelType,
  TextChannel,
} from "discord.js";

import { IDelayAlarm } from "../../services/cronjob";

import { IBot } from ".";
import Logger from "../logger";
import { getSettingValue, Settings } from "../settings";

export class DiscordBot implements IBot {
  private bot: Client;
  private static readonly botName = "DiscordBot";

  static async of(cb: (err: Error, bot: DiscordBot) => void) {
    Logger.debug(`[${DiscordBot.botName}] Getting instance`);

    const key = await getSettingValue(Settings.DISCORD_KEY);

    const client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });

    client.on("ready", () => {
      cb(null, new DiscordBot(client));
    });

    client.on("error", (err) => {
      cb(err, null);
    });

    //make sure this line is the last line
    client.login(key);
  }

  constructor(bot: Client) {
    this.bot = bot;
  }

  async getChannel(): Promise<TextChannel | undefined> {
    const channelID = await getSettingValue(Settings.DISCORD_CHANNEL_ID);
    const channel = this.bot.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildText && channel.id === channelID
    ) as TextChannel;

    return channel;
  }

  async sendMessage(message: string) {
    Logger.info(`[${DiscordBot.botName}] Sending Message`);
    const channel = await this.getChannel();
    if (channel) channel.send(message);
  }

  async sendDelayNotifications(notifications: IDelayAlarm[]) {
    let res = "";

    for (const not of notifications) {
      res += not.stop.buildDeviationMessages().join("\n-");
    }

    await this.sendMessage(res);
  }
}

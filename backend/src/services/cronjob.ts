import cron from "node-cron";
import WebSocket from "ws";
import { ChannelType, TextChannel } from "discord.js";

import { wsserver } from "../app";

import Logger from "../config/logger";
import { WebSocketEvents } from "../config/ws";

import Alarm from "../components/alarms/model";
import { RMVApi } from "../components/rmv/api";
import { Journey } from "../components/rmv/models/Journey";
import { getTelegramBot } from "../config/bots/telegram";
import { getSettingValue, Settings } from "../config/settings";
import { getDiscordBot } from "../config/bots/discord";

/**
 * Job for sending schedule changes via WS
 */
cron.schedule("*/15 * * * *", async () => {
  try {
    Logger.info("[CRONJOB] Starting");

    const data = [];
    const alarms = await Alarm.findAll();

    for (const alarm of alarms) {
      const { journeyRef, station_id, telegram } = alarm.get();

      const journeyDetails = await RMVApi.getJourneyDetails(journeyRef);
      const journey = Journey.ofJourneyDetails(journeyDetails);

      const stop = journey.getStopByID(station_id);

      if (stop.hasDelay())
        data.push({
          direction: journey.directions[0],
          product: journey.products[0],
        });
      else Logger.error(`[CRONJOB] Stop ${stop.id} not found in API response`);
    }

    if (data.length) {
      Logger.info(
        `[CRONJOB] Sending ${data.length} schedule changes to ${wsserver.clients.size} clients`
      );

      wsserver.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              event: WebSocketEvents.CronjobTimetable,
              body: data,
            })
          );
        }
      });

      /*
      Logger.debug(`[CRONJOB] Getting TelegramBot instance`);
      const telegramBot = await getTelegramBot();

      if (telegramBot) {
        Logger.debug(`[CRONJOB] Reading Telegram ChatID`);
        const chatID = await getSettingValue(Settings.TELEGRAM_CHAT_ID);

        if (chatID) {
          Logger.info(`[CRONJOB] Sending Telegram message`);
          telegramBot.sendMessage(chatID, "Delay message");
        }
      }
      */

      Logger.debug(`[CRONJOB] Getting DiscordBot instance`);
      getDiscordBot(async (err, client) => {
        if (err) {
          Logger.error(err.stack);
          return;
        }

        Logger.debug(`[CRONJOB] Reading Discoard ChannelID`);
        const channelID = await getSettingValue(Settings.DISCORD_CHANNEL_ID);
        const channel = client.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildText && channel.id === channelID
        ) as TextChannel;

        if (channel) {
          Logger.info(`[CRONJOB] Sending Discord message`);
          channel.send("My notification");
        }
      });
    }
  } catch (err) {
    Logger.error(err.stack || err);
  } finally {
    Logger.info("[CRONJOB] Finished");
  }
});

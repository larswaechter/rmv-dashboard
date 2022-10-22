import cron from "node-cron";
import WebSocket from "ws";

import { wsserver } from "../app";

import Logger from "../config/logger";
import { WebSocketEvents } from "../config/ws";

import Alarm from "../components/alarms/model";
import { RMVApi } from "../components/rmv/api";
import { Journey } from "../components/rmv/models/Journey";
import { TelegramBot } from "../config/bots/telegram";
import { DiscordBot } from "../config/bots/discord";

/**
 * Job for sending schedule changes via WS
 */
cron.schedule("*/15 * * * * *", async () => {
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

      /**
       * WebSocket
       */

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

      /**
       * Telegram
       */

      const telegramBot = await TelegramBot.of();
      if (telegramBot) telegramBot.sendMessage("Delay message");

      /**
       * Discord
       */

      DiscordBot.of((err, bot) => {
        if (err) Logger.error(err.stack);
        else bot.sendMessage("Delay message");
      });
    }
  } catch (err) {
    Logger.error(err.stack || err);
  } finally {
    Logger.info("[CRONJOB] Finished");
  }
});

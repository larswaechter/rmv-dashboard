import cron from "node-cron";
import WebSocket from "ws";

import { wsserver } from "../app";

import Logger from "../config/logger";
import { WebSocketEvents } from "../config/ws";

import Alarm from "../components/alarms/model";
import { RMVApi } from "../components/rmv/api";
import { Journey } from "../components/rmv/models/Journey";
import { getTelegramBot } from "../config/bots/telegram";
import SettingsModel from "../components/settings/model";
import { Settings } from "../config/settings";

/**
 * Job for sending schedule changes via WS
 */
cron.schedule("*/15 * * * * *", async () => {
  try {
    Logger.info("[CRONJOB] Starting");

    const data = [];
    const alarms = await Alarm.findAll();

    for (const alarm of alarms) {
      const { journeyRef, station_id } = alarm.get();

      const journeyDetails = await RMVApi.getJourneyDetails(journeyRef);
      const journey = Journey.ofJourneyDetails(journeyDetails);

      const stop = journey.getStopByID(station_id);

      if (stop)
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

      Logger.debug(`[CRONJOB] Getting TelegramBot instance`);
      const telegramBot = await getTelegramBot();

      if (telegramBot) {
        Logger.debug(`[CRONJOB] Reading Telegram ChatID`);
        const setting = await SettingsModel.findOne({
          where: {
            key: Settings.TELEGRAM_CHAT_ID,
          },
        });

        const chatID = setting.getDataValue("value");
        if (chatID) {
          Logger.info(`[CRONJOB] Sending Telegram message`);
          telegramBot.sendMessage(chatID, "Delay message");
        }
      }
    }
  } catch (err) {
    Logger.error(err.stack || err);
  } finally {
    Logger.info("[CRONJOB] Finished");
  }
});

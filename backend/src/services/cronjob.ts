import cron from "node-cron";
import WebSocket from "ws";
import { Model } from "sequelize";

import { wsserver } from "../app";

import Logger from "../config/logger";
import { WebSocketEvents } from "../config/ws";

import Alarm from "../components/alarms/model";
import { RMVApi } from "../components/rmv/api";
import { Journey } from "../components/rmv/models/Journey";
import { TelegramBot } from "../config/bots/telegram";
import { DiscordBot } from "../config/bots/discord";
import { IDirection } from "../components/rmv/models/Misc";
import { Product } from "../components/rmv/models/Product";
import { Stop } from "../components/rmv/models/Stop";

class ScheduleChangesNotification {
  private timestamp: number = Date.now();
  private scheduleChanges: IScheduleChange[];
  private content: string;
}

export interface IScheduleChange {
  stop: Stop;
  alarm: Model;
  direction: IDirection;
  product: Product;
}

/**
 * Job for sending schedule changes via WS
 */
cron.schedule("*/15 * * * * *", async () => {
  try {
    Logger.info("[CRONJOB] Starting");

    const alarms = await Alarm.findAll();
    const scheduleChanges: IScheduleChange[] = [];

    for (const alarm of alarms) {
      const { journeyRef, station_id } = alarm.get();

      const journeyDetails = await RMVApi.getJourneyDetails(journeyRef);
      const journey = Journey.ofJourneyDetails(journeyDetails);

      const stop = journey.getStopByID(station_id);

      if (stop.hasScheduleChange())
        scheduleChanges.push({
          stop,
          alarm,
          direction: journey.directions[0],
          product: journey.products[0],
        });
      else Logger.error(`[CRONJOB] Stop ${stop.id} not found in API response`);
    }

    if (scheduleChanges.length) {
      Logger.info(
        `[CRONJOB] Sending ${scheduleChanges.length} schedule changes to ${wsserver.clients.size} WebSocket clients`
      );

      /**
       * WebSocket
       */

      wsserver.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              event: WebSocketEvents.CronjobTimetable,
              body: scheduleChanges,
            })
          );
        }
      });

      /**
       * Telegram
       */

      const telegramBot = await TelegramBot.of();
      if (telegramBot)
        telegramBot.sendDelayNotifications(
          scheduleChanges.filter((notification) =>
            notification.alarm.getDataValue("telegram")
          )
        );

      /**
       * Discord
       */

      DiscordBot.of((err, bot) => {
        if (err) Logger.error(err.stack);
        else
          bot.sendDelayNotifications(
            scheduleChanges.filter((notification) =>
              notification.alarm.getDataValue("discord")
            )
          );
      });
    }
  } catch (err) {
    Logger.error(err.stack || err);
  } finally {
    Logger.info("[CRONJOB] Finished");
  }
});

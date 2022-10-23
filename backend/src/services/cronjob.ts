import cron from "node-cron";
import WebSocket from "ws";
import { Model } from "sequelize";

import { wsserver } from "../app";

import Logger from "../config/logger";
import { WebSocketEvents } from "../config/ws";

import { Alarm, AlarmHistory } from "../components/alarms/model";
import { RMVApi } from "../components/rmv/api";
import { Journey } from "../components/rmv/models/Journey";
import { TelegramBot } from "../config/bots/telegram";
import { DiscordBot } from "../config/bots/discord";
import { IDirection } from "../components/rmv/models/Misc";
import { Product } from "../components/rmv/models/Product";
import { Stop } from "../components/rmv/models/Stop";

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
      const { id, journeyRef, station_id, autoremove, smartmode } = alarm.get();

      const journeyDetails = await RMVApi.getJourneyDetails(journeyRef);
      const journey = Journey.ofJourneyDetails(journeyDetails);

      const stop = journey.getStopByID(station_id);

      if (!stop) {
        Logger.error(`[CRONJOB] Stop ${stop.id} not found in API response`);
        continue;
      }

      if (autoremove && stop.wasReached()) {
        await Alarm.destroy({
          where: {
            id,
            autoremove: true,
          },
        });
      } else if (stop.hasScheduleChange()) {
        const scheduleHash = stop.getScheduleHash();
        const history = await AlarmHistory.findOne({
          where: {
            journeyRef,
            station_id,
          },
        });

        if (
          !history ||
          !smartmode ||
          scheduleHash !== history.getDataValue("scheduleHash")
        ) {
          scheduleChanges.push({
            stop,
            alarm,
            direction: journey.directions[0],
            product: journey.products[0],
          });

          if (!history)
            await AlarmHistory.create({
              AlarmId: id,
              journeyRef,
              station_id,
              scheduleHash,
            });
          else
            await AlarmHistory.update(
              { scheduleHash },
              {
                where: {
                  journeyRef,
                  station_id,
                },
              }
            );
        }
      }
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
    Logger.error(err.message || err);
  } finally {
    Logger.info("[CRONJOB] Finished");
  }
});

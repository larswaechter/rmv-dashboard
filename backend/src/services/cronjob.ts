import cron from 'node-cron';
import WebSocket from 'ws';
import dayjs from 'dayjs';
import { Model } from 'sequelize';

import Logger from '../config/logger';
import { WebSocketEvents } from '../config/ws';

import { Alarm, AlarmHistory } from '../components/alarms/model';
import { RMVApi } from '../components/rmv/api';
import { Journey } from '../components/rmv/models/Journey';
import { TelegramBot } from '../config/bots/Telegram';
import { DiscordBot } from '../config/bots/Discord';
import { IDirection } from '../components/rmv/models/Misc';
import { Product } from '../components/rmv/models/Product';
import { Stop } from '../components/rmv/models/Stop';
import { Server } from '../server';

export interface IScheduleChange {
  stop: Stop;
  alarm: Model;
  direction: IDirection;
  product: Product;
}

/**
 * Job for sending schedule changes via WS
 */
cron.schedule('*/15 * * * *', async () => {
  try {
    Logger.info('[CRONJOB] Starting');

    const scheduleChanges: IScheduleChange[] = [];
    const alarms = await Alarm.findAll({
      where: {
        active: true
      }
    });

    for (const alarm of alarms) {
      const { id, journeyRef, stationId, autoremove, smartmode, interval, telegram, discord } =
        alarm.get();

      const journeyDetails = await RMVApi.getJourneyDetails(journeyRef);
      const journey = Journey.ofJourneyDetails(journeyDetails);

      const stop = journey.getStopByID(stationId);

      if (!stop) {
        Logger.error(`[CRONJOB] Stop ${stop.id} not found in API response`);
        continue;
      }

      const stopDate = stop.getOriginalDateTimeOrFallback().date;

      if (stop.wasReached()) {
        // Interval set && stop is in future
        if (interval > 0 && dayjs(stopDate).isAfter(dayjs())) {
          Logger.debug(`[CRONJOB] Searching continual departure: ${stop.id}`);

          const next = await journey.getContinualDeparture(stationId, interval);
          if (next) {
            const existing = await Alarm.findOne({
              where: {
                stationId,
                journeyRef: next.journeyRef
              }
            });
            if (!existing) {
              Logger.info(`[CRONJOB] Saving continual departure: ${stop.id}`);
              await Alarm.create({
                journeyRef: next.journeyRef,
                stationId,
                autoremove,
                telegram,
                discord,
                interval
              });
            }
          } else Logger.info(`[CRONJOB] No continual departure found: ${stop.id}`);
        }

        // Delete / Set inactive
        if (autoremove)
          await Alarm.destroy({
            where: {
              id,
              autoremove: true
            }
          });
        else {
          Alarm.update(
            {
              active: false
            },
            {
              where: {
                id
              }
            }
          );
        }
      } else if (stop.hasScheduleChange()) {
        const scheduleHash = stop.getScheduleHash();
        const history = await AlarmHistory.findOne({
          where: {
            journeyRef,
            stationId
          }
        });

        if (!history || !smartmode || scheduleHash !== history.getDataValue('scheduleHash')) {
          scheduleChanges.push({
            stop,
            alarm,
            direction: journey.directions[0],
            product: journey.products[0]
          });

          if (history)
            await AlarmHistory.update(
              { scheduleHash },
              {
                where: {
                  journeyRef,
                  stationId
                }
              }
            );
          else
            await AlarmHistory.create({
              alarmId: id,
              journeyRef,
              stationId,
              scheduleHash
            });
        }
      }
    }

    if (scheduleChanges.length) {
      Logger.info(
        `[CRONJOB] Sending ${scheduleChanges.length} schedule changes to ${Server.wss.clients.size} WebSocket clients`
      );

      /**
       * WebSocket
       */
      Server.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              event: WebSocketEvents.CronjobTimetable,
              body: scheduleChanges
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
          scheduleChanges.filter((notification) => notification.alarm.getDataValue('telegram'))
        );

      /**
       * Discord
       */
      DiscordBot.of((err, bot) => {
        if (err) Logger.error(err.stack);
        else
          bot.sendDelayNotifications(
            scheduleChanges.filter((notification) => notification.alarm.getDataValue('discord'))
          );
      });
    }
  } catch (err) {
    Logger.error(err.message || err);
  } finally {
    Logger.info('[CRONJOB] Finished');
  }
});

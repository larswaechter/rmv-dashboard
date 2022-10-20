import cron from "node-cron";
import WebSocket from "ws";

import { wsserver } from "../app";

import logger from "../config/logger";
import { WebSocketEvents } from "../config/ws";

import Alarm from "../components/alarms/model";
import { RMVApi } from "../components/rmv/api";
import { Journey } from "../components/rmv/models/Journey";

/**
 * Job for sending schedule changes via WS
 */
cron.schedule("*/15 * * * *", async () => {
  if (!wsserver.clients.size) {
    logger.info("[CRONJOB] Skipped because there are no connected clients");
    return;
  }

  try {
    logger.info("[CRONJOB] Starting");

    const data = [];
    const alarms = await Alarm.findAll();

    for (const alarm of alarms) {
      const { journeyRef, station_id, autoremove } = alarm.get();

      const journey = await RMVApi.getJourneyDetails(journeyRef);
      const { direction, product, stops } = Journey.ofJourneyDetails(journey);

      const stop = stops.find((stop) => stop.id === station_id);

      if (stop) data.push({ direction, product });
      else logger.error(`[CRONJOB] Stop ${stop.id} not found in API response`);
    }

    logger.info(
      `[CRONJOB] Sending ${data.length} schedule changes to ${wsserver.clients.size} clients`
    );

    wsserver.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: WebSocketEvents.cronjob_timetable,
            body: data,
          })
        );
      }
    });
  } catch (err) {
    logger.error(err.stack || err);
  } finally {
    logger.info("[CRONJOB] Finished");
  }
});

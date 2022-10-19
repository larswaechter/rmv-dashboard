const cron = require("node-cron");
const WebSocket = require("ws");

const { wss } = require("../app");
const logger = require("../config/logger");
const { WebSocketEvents } = require("../config/ws");
const Alarm = require("../components/alarms/model");

const { parseJourney } = require("./parser");
const { getJourneyDetails } = require("./rmv");

/**
 * Job for sending timetable changes via WS
 */
cron.schedule("*/10 * * * * *", async () => {
  try {
    logger.info("[CRONJOB] Starting");

    const data = [];
    const alarms = await Alarm.findAll();

    for (const alarm of alarms) {
      const { journeyRef, station_id, autoremove } = alarm.get();

      const journey = await getJourneyDetails(journeyRef);
      const { direction, product, stops } = parseJourney(journey);

      const stop = stops.find((stop) => stop.id === station_id);

      if (stop)
        data.push({
          direction,
          product,
          stop,
        });
      else logger.error(`[CRONJOB] Stop ${stop.id} not found in API response`);
    }

    logger.info(
      `[CRONJOB] Sending ${data.length} messages to ${wss.clients.size} clients`
    );

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: WebSocketEvents.cronjob_timetable,
            body: {
              title: "Fahrplanänderungen",
              changes: data,
            },
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

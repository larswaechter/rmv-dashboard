const logger = require("../../config/logger");
const rmv = require("../../services/rmv");
const { parseJourney } = require("../../services/parser");

const DelayAlarm = require("./model");

const DelayAlarmsController = {
  getAlarms: async (req, res) => {
    try {
      const alarms = await DelayAlarm.findAll();

      res.json(alarms);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  getAlarm: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await DelayAlarm.findByPk(+id);

      res.json(alarm);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  getAlarmDetails: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await DelayAlarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      const journey = await rmv.getJourneyDetails(alarm.journeyRef);
      const parsed = parseJourney(journey);

      parsed["stop"] = parsed.stops.find(
        (stop) => stop.id === alarm.station_id
      );

      delete parsed.stops;

      res.json(parsed);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  createAlarm: async (req, res) => {
    try {
      const alarm = req.body;
      if (!alarm) res.sendStatus(400);

      const newAlarm = await DelayAlarm.create(alarm);

      res.status(201).json(newAlarm);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  deleteAlarm: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await DelayAlarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      await DelayAlarm.destroy({
        where: {
          id,
        },
      });

      res.sendStatus(204);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },
};

module.exports = DelayAlarmsController;

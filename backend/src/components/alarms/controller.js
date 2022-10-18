const logger = require("../../config/logger");
const rmv = require("../../services/rmv");
const { parseJourney } = require("../../services/parser");

const Alarm = require("./model");

const AlarmsController = {
  getAlarms: async (req, res) => {
    try {
      const alarms = await Alarm.findAll();

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

      const alarm = await Alarm.findByPk(+id);

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

      const alarm = await Alarm.findByPk(+id);
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

      const newAlarm = await Alarm.create(alarm);

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

      const alarm = await Alarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      await Alarm.destroy({
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

module.exports = AlarmsController;

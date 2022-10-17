const logger = require("../../config/logger");
const rmv = require("../../services/rmv");
const { parseDeparture } = require("../../services/parser");

const StationsRepo = require("./repository");

const StationsController = {
  getStations: async (req, res) => {
    try {
      const stations = await StationsRepo.findAll();
      res.json(stations);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  getStation: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const stations = await StationsRepo.find(id);
      res.json(stations);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  getStationDepartures: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const station = await StationsRepo.find(+id);
      if (!station) return res.sendStatus(404);

      const departures = await rmv.getDepartureBoard(station.station_id);
      const prepared =
        "Departure" in departures
          ? departures.Departure.map(parseDeparture)
          : [];

      res.json(prepared);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  searchStations: async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) return res.sendStatus(400);

      const stations = await rmv.searchStations(name);
      const prepared = stations.stopLocationOrCoordLocation.map(
        ({ StopLocation }) => ({
          station_id: StopLocation.id,
          name: StopLocation.name,
        })
      );

      res.json(prepared);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  createStation: async (req, res) => {
    try {
      const station = req.body;
      if (!station) res.sendStatus(400);

      await StationsRepo.create(station);
      res.sendStatus(201);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },

  deleteStation: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const station = await StationsRepo.find(+id);
      if (!station) return res.sendStatus(404);

      await StationsRepo.delete(+id);
      res.sendStatus(204);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },
};

module.exports = StationsController;

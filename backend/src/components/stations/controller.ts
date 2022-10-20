import logger from "../../config/logger";

import { RMVApi } from "../rmv/api";
import { Departure } from "../rmv/models/Departure";

import Station from "./model";

export class StationsController {
  getStations = async (req, res) => {
    try {
      const stations = await Station.findAll();

      res.json(stations);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  };

  getStation = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const station = await Station.findByPk(+id);

      res.json(station);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  };

  getStationDepartures = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const station = await Station.findByPk(+id);
      if (!station) return res.sendStatus(404);

      const departures = await RMVApi.getDepartureBoard(
        station.getDataValue("station_id")
      );

      const prepared =
        "Departure" in departures
          ? departures.Departure.map((dep) => Departure.ofResponse(dep))
          : [];

      res.json(prepared);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  };

  searchStations = async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) return res.sendStatus(400);

      const stations = await RMVApi.searchStations(name);
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
  };

  createStation = async (req, res) => {
    try {
      const station = req.body;
      if (!station) res.sendStatus(400);

      const newStation = await Station.create(station);

      res.status(201).json(newStation);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  };

  deleteStation = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const station = await Station.findByPk(+id);
      if (!station) return res.sendStatus(404);

      await Station.destroy({
        where: {
          id,
        },
      });

      res.sendStatus(204);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  };
}

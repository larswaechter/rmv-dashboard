import logger from "../../config/logger";

import { RMVApi } from "../rmv/api";
import { Departure } from "../rmv/models/Departure";
import { Station as RMVStation } from "../rmv/models/Station";

import Station from "./model";

export class StationsController {
  async getStations(req, res) {
    try {
      const stations = await Station.findAll();

      res.json(stations);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async getStation(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const station = await Station.findByPk(+id);

      res.json(station);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async getStationDepartures(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const station = await Station.findByPk(+id);
      if (!station) return res.sendStatus(404);

      const board = await RMVApi.getDepartureBoard(
        station.getDataValue("station_id")
      );

      const prepared = Departure.ofDepartureBoard(board);

      res.json(prepared);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async searchStations(req, res) {
    try {
      const { name } = req.query;
      if (!name) return res.sendStatus(400);

      const stations = await RMVApi.searchStations(name);
      const prepared = stations.stopLocationOrCoordLocation.map((location) =>
        RMVStation.ofResponse(location.StopLocation)
      );

      res.json(prepared);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async createStation(req, res) {
    try {
      const station = req.body;
      if (!station) res.sendStatus(400);

      const newStation = await Station.create(station);

      res.status(201).json(newStation);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async deleteStation(req, res) {
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
  }
}

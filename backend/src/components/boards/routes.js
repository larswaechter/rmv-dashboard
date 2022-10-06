const { Router } = require("express");

const logger = require("../../config/logger");
const { findAllStations } = require("../stations/query");
const { getArrivalBoard, getDepartureBoard } = require("../../services/rmv");

router = Router();

const parseDeparture = (departure) => {
  return {
    name: departure.name,
    date: departure.date,
    time: departure.time,
    direction: departure.direction,
    track: departure.track,
    journeyRef: departure.JourneyDetailRef.ref,
    catOut: departure.Product ? departure.Product[0].catOut : "",
  };
};

router.get("/departure", async (req, res) => {
  try {
    const stations = await findAllStations();
    const departures = await Promise.all(
      stations.map((board) => getDepartureBoard(board.station_id))
    );

    const prepared = stations.map((board, i) => ({
      id: board.id,
      name: board.name,
      departures: departures[i].Departure.map(parseDeparture),
    }));

    res.json(prepared);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;

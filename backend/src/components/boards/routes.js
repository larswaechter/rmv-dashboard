const { Router } = require("express");

const logger = require("../../config/logger");
const { findAllStations } = require("../stations/query");
const { getArrivalBoard, getDepartureBoard } = require("../../services/rmv");

router = Router();

router.get("/arrival", async (req, res) => {
  const stations = await findAllStations();
  const data = await Promise.all(
    stations.map((board) => getArrivalBoard(board.station_id))
  );

  const prepared = stations.map((board, i) => ({
    id: board.id,
    name: board.name,
    departures: data[i].Departure.map((departure) => ({
      name: departure.name,
      date: departure.date,
      time: departure.time,
      direction: departure.direction,
      track: departure.track,
    })),
  }));

  res.json(prepared);
});

router.get("/departure", async (req, res) => {
  try {
    const stations = await findAllStations();
    const data = await Promise.all(
      stations.map((board) => getDepartureBoard(board.station_id))
    );

    const prepared = stations.map((board, i) => ({
      id: board.id,
      name: board.name,
      departures: data[i].Departure.map((departure) => ({
        name: departure.name,
        date: departure.date,
        time: departure.time,
        direction: departure.direction,
        track: departure.track,
      })),
    }));

    res.json(prepared);
  } catch (err) {
    logger.error(err.stack);
    res.sendStatus(500);
  }
});

module.exports = router;

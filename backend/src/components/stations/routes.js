const { Router } = require("express");
const logger = require("../../config/logger");

const { parseDeparture } = require("../../services/parser");
const { searchStations, getDepartureBoard } = require("../../services/rmv");

const {
  findAllStations,
  createStation,
  deleteStation,
  findStation,
} = require("./query");

router = Router();

router.get("", async (req, res) => {
  try {
    const stations = await findAllStations();
    res.json(stations);
  } catch (err) {
    logger.error(err.stack || err);
    res.sendStatus(500);
  }
});

router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.sendStatus(400);

    const stations = await searchStations(name);
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
});

router.post("", async (req, res) => {
  try {
    const station = req.body;
    if (!station) res.sendStatus(400);

    await createStation(station);
    res.sendStatus(201);
  } catch (err) {
    logger.error(err.stack || err);
    res.sendStatus(500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.sendStatus(400);

    const station = await findStation(+id);
    if (!station) return res.sendStatus(404);

    await deleteStation(+id);
    res.sendStatus(204);
  } catch (err) {
    logger.error(err.stack || err);
    res.sendStatus(500);
  }
});

router.get("/departures", async (req, res) => {
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
    logger.error(err.stack || err);
    res.sendStatus(500);
  }
});

module.exports = router;

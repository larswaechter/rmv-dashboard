const { Router } = require("express");
const logger = require("../../config/logger");

const { getRealtimeValue } = require("../../services/helper");
const { parseJourney } = require("../../services/parser");
const { getJourney } = require("../../services/rmv");

router = Router();

router.get("/search", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.sendStatus(400);

    const journey = await getJourney(id);
    const parsed = parseJourney(journey);

    res.json(parsed);
  } catch (err) {
    logger.error(err.stack || err);
    res.sendStatus(500);
  }
});

module.exports = router;

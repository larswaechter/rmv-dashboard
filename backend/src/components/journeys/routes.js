const { Router } = require("express");
const logger = require("../../config/logger");

const { getJourney } = require("../../services/rmv");

router = Router();

router.get("/search", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.sendStatus(400);

    const journey = await getJourney(id);

    res.json(journey);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;

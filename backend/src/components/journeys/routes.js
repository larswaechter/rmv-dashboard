const { Router } = require("express");

const { getJourney } = require("../../services/rmv");

router = Router();

router.get("/search", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.sendStatus(400);

  const journey = await getJourney(id);

  res.json(journey);
});

module.exports = router;

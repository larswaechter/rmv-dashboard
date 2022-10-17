const { Router } = require("express");
const JourneysController = require("./controller");

router = Router();

router.get("/search", JourneysController.searchJourney);

module.exports = router;

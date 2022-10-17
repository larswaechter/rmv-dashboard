const logger = require("../../config/logger");
const { getJourneyDetails } = require("../../services/rmv");
const { parseJourney } = require("../../services/parser");

const JourneysController = {
  searchJourney: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.sendStatus(400);

      const journey = await getJourneyDetails(id);
      const parsed = parseJourney(journey);

      res.json(parsed);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  },
};

module.exports = JourneysController;

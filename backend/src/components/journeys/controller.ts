import logger from "../../config/logger";
import { RMVApi } from "../rmv/api";
import { Journey } from "../rmv/models/Journey";

export class JourneysController {
  searchJourney = async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.sendStatus(400);

      const journey = await RMVApi.getJourneyDetails(id);
      const parsed = Journey.ofResponse(journey);

      res.json(parsed);
    } catch (err) {
      logger.error(err.stack || err);
      res.sendStatus(500);
    }
  };
}

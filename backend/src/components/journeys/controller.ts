import Logger from "../../config/logger";

import { RMVApi } from "../rmv/api";
import { Journey } from "../rmv/models/Journey";

export class JourneysController {
  async searchJourney(req, res) {
    try {
      const { id } = req.query;
      if (!id) return res.sendStatus(400);

      const journey = await RMVApi.getJourneyDetails(id);
      const parsed = Journey.ofJourneyDetails(journey);

      res.json(parsed);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }
}

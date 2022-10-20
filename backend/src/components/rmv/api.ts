import logger from "../../config/logger";
import { IDepartureBoard } from "./models/Departure";
import { IJourneyDetails } from "./models/Journey";
import { IStation } from "./models/Station";

const headers = {
  Accept: "application/json",
};

export class RMVApi {
  private static RMV_URL = "https://www.rmv.de/hapi";

  static getDepartureBoard(stop_id): Promise<IDepartureBoard> {
    const url = `${RMVApi.RMV_URL}/departureBoard?`;
    logger.debug(`[RMV] GET ${url}`);

    return fetch(
      url +
        new URLSearchParams({
          accessId: process.env.RMV_KEY,
          id: stop_id,
        }),
      {
        headers,
      }
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .catch((err) => {
        logger.error(err.stack);
        return Promise.reject("[RMV] GET /departureBoard failed");
      });
  }

  static searchStations(name): Promise<IStation> {
    const url = `${RMVApi.RMV_URL}/location.name?`;
    logger.debug(`[RMV] GET ${url}`);

    return fetch(
      url +
        new URLSearchParams({
          accessId: process.env.RMV_KEY,
          input: name,
          type: "S", // Filter stations
        }),
      {
        headers,
      }
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .catch((err) => {
        logger.error(err.stack);
        return Promise.reject("[RMV] GET /location.name failed");
      });
  }

  static getJourneyDetails(id): Promise<IJourneyDetails> {
    const url = `${RMVApi.RMV_URL}/journeyDetails?`;
    logger.debug(`[RMV] GET ${url}`);

    return fetch(
      url +
        new URLSearchParams({
          accessId: process.env.RMV_KEY,
          id,
        }),
      {
        headers,
      }
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .catch((err) => {
        logger.error(err.stack);
        return Promise.reject("[RMV] GET /journeyDetails failed");
      });
  }
}

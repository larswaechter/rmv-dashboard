import Logger from "../../config/logger";

import { IDepartureBoard } from "./models/Departure";
import { IJourneyDetails } from "./models/Journey";
import { IStation } from "./models/Station";

type Endpoints = "departureBoard" | "location.name" | "journeyDetails";

export class RMVApi {
  private static RMV_URL = "https://www.rmv.de/hapi";
  private static Headers = {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.RMV_KEY}`,
  };

  static buildURL(endpoint: Endpoints, params: Record<string, string>) {
    return `${RMVApi.RMV_URL}/${endpoint}?${new URLSearchParams(params)}`;
  }

  static getDepartureBoard(
    stop_id: string,
    date: string,
    time: string
  ): Promise<IDepartureBoard> {
    const url = RMVApi.buildURL("departureBoard", {
      id: stop_id,
      date,
      time,
    });

    Logger.debug(`[RMVApi] GET ${url}`);

    return fetch(url, {
      headers: RMVApi.Headers,
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .catch((err) => {
        Logger.error(err.stack);
        return Promise.reject("[RMVApi] GET /departureBoard failed");
      });
  }

  static searchStations(name: string): Promise<IStation> {
    const url = RMVApi.buildURL("location.name", {
      input: name,
      type: "S", // Filter stations
    });

    Logger.debug(`[RMVApi] GET ${url}`);

    return fetch(url, {
      headers: RMVApi.Headers,
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .catch((err) => {
        Logger.error(err.stack);
        return Promise.reject("[RMVApi] GET /location.name failed");
      });
  }

  static getJourneyDetails(id: string): Promise<IJourneyDetails> {
    const url = RMVApi.buildURL("journeyDetails", {
      id,
    });

    Logger.debug(`[RMVApi] GET ${url}`);

    return fetch(url, {
      headers: RMVApi.Headers,
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .catch((err) => {
        Logger.error(err.stack);
        return Promise.reject("[RMVApi] GET /journeyDetails failed");
      });
  }
}

const logger = require("../config/logger");

const RMV_URL = "https://www.rmv.de/hapi";
const headers = {
  Accept: "application/json",
};

const getDepartureBoard = (stop_id) => {
  const url = `${RMV_URL}/departureBoard?`;
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
};

const searchStations = (name) => {
  const url = `${RMV_URL}/location.name?`;
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
};

const getJourneyDetails = (id) => {
  const url = `${RMV_URL}/journeyDetails?`;
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
};

module.exports = {
  getDepartureBoard,
  searchStations,
  getJourneyDetails,
};

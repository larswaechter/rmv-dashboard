const logger = require("../config/logger");

const RMV_URL = "https://www.rmv.de/hapi";
const headers = {
  Accept: "application/json",
};

const getDepartureBoard = (stop_id) => {
  const url = `${RMV_URL}/departureBoard?`;
  logger.debug(`API Call ${url}`);

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
    .then((response) => response.json())
    .catch((err) => {
      logger.error(err.stack);
      return Promise.reject("API call /departureBoard failed");
    });
};

const searchStations = (name) => {
  const url = `${RMV_URL}/location.name?`;
  logger.debug(`API Call ${url}`);

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
    .then((response) => response.json())
    .catch((err) => {
      logger.error(err.stack);
      return Promise.reject("API call /location.name failed");
    });
};

const getJourney = (id) => {
  const url = `${RMV_URL}/journeyDetails?`;
  logger.debug(`API Call ${url}`);

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
    .then((response) => response.json())
    .catch((err) => {
      logger.error(err.stack);
      return Promise.reject("API call /journeyDetails failed");
    });
};

module.exports = {
  getDepartureBoard,
  searchStations,
  getJourney,
};

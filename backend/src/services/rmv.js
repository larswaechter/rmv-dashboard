const logger = require("../config/logger");

const BASE_URL = "https://www.rmv.de/hapi";
const headers = {
  Accept: "application/json",
};

const getArrivalBoard = (stop_id) =>
  fetch(
    `${BASE_URL}/departureBoard?` +
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
    });

const getDepartureBoard = (stop_id) =>
  fetch(
    `${BASE_URL}/departureBoard?` +
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
    });

const searchStations = (name) =>
  fetch(
    `${BASE_URL}/location.name?` +
      new URLSearchParams({
        accessId: process.env.RMV_KEY,
        input: name,
        type: "S",
      }),
    {
      headers,
    }
  )
    .then((response) => response.json())
    .catch((err) => {
      logger.error(err.stack);
    });

const getJourney = (id) =>
  fetch(
    `${BASE_URL}/journeyDetails?` +
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
    });

module.exports = {
  getArrivalBoard,
  getDepartureBoard,
  searchStations,
  getJourney,
};

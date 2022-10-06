const logger = require("../config/logger");

const headers = {
  Accept: "application/json",
};

const getArrivalBoard = (stop_id) =>
  fetch(
    `${process.env.RMV_URL}/arrivalBoard?` +
      new URLSearchParams({
        accessId: process.env.RMV_KEY,
        id: stop_id,
      }),
    {
      headers,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      logger.debug(data);
      return Promise.resolve(data);
    })
    .catch((err) => {
      logger.error(err.stack);
      return Promise.reject("API call /arrivalBoard failed");
    });

const getDepartureBoard = (stop_id) =>
  fetch(
    `${process.env.RMV_URL}/departureBoard?` +
      new URLSearchParams({
        accessId: process.env.RMV_KEY,
        id: stop_id,
      }),
    {
      headers,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      logger.debug(data);
      return Promise.resolve(data);
    })
    .catch((err) => {
      logger.error(err.stack);
      return Promise.reject("API call /departureBoard failed");
    });

const searchStations = (name) =>
  fetch(
    `${process.env.RMV_URL}/location.name?` +
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
    .then((data) => {
      logger.debug(data);
      return Promise.resolve(data);
    })
    .catch((err) => {
      logger.error(err.stack);
      return Promise.reject("API call /location.name failed");
    });

const getJourney = (id) =>
  fetch(
    `${process.env.RMV_URL}/journeyDetails?` +
      new URLSearchParams({
        accessId: process.env.RMV_KEY,
        id,
      }),
    {
      headers,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      logger.debug(data);
      return Promise.resolve(data);
    })
    .catch((err) => {
      logger.error(err.stack);
      return Promise.reject("API call /journeyDetails failed");
    });

module.exports = {
  getArrivalBoard,
  getDepartureBoard,
  searchStations,
  getJourney,
};

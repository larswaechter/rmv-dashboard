const BASE_URL = "http://localhost:8080";
const headers = {
  Accept: "application/json",
};

export const getArrivals = (stop) =>
  fetch(`${BASE_URL}/boards/arrival`, {
    headers,
  }).then((response) => response.json());

export const getDepartures = (stop) =>
  fetch(`${BASE_URL}/boards/departure`, {
    headers,
  }).then((response) => response.json());

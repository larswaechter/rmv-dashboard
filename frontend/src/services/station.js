const BASE_URL = "http://localhost:8080";
const headers = {
  Accept: "application/json",
};

export const searchStations = (stop) =>
  fetch(
    `${BASE_URL}/stations/search?` +
      new URLSearchParams({
        name: stop,
      }),
    {
      headers,
    }
  ).then((response) => response.json());

export const saveStation = (station) =>
  fetch(`${BASE_URL}/stations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(station),
  });

export const deleteStation = (id) =>
  fetch(`${BASE_URL}/stations/${id}`, {
    method: "DELETE",
  });

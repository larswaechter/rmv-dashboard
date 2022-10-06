const BASE_URL = "http://localhost:8080";
const headers = {
  Accept: "application/json",
};

export const getDepartures = () =>
  fetch(`${BASE_URL}/stations/departures`, {
    headers,
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject("Failed to fetch departures!");
    });

export const searchStations = (stop) =>
  fetch(
    `${BASE_URL}/stations/search?` +
      new URLSearchParams({
        name: stop,
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
      console.error(err);
      return Promise.reject("Failed to fetch stations!");
    });

export const createStation = (station) =>
  fetch(`${BASE_URL}/stations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(station),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject("Failed to save station!");
    });

export const deleteStation = (id) =>
  fetch(`${BASE_URL}/stations/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject("Failed to delete station!");
    });

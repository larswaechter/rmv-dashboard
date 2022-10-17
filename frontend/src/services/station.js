export const getStations = () =>
  fetch(`api/stations`, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject("Failed to fetch stations!");
    });

export const getStationDepartures = (id) =>
  fetch(`api/stations/${id}/departures`, {
    headers: {
      Accept: "application/json",
    },
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
    `api/stations/search?` +
      new URLSearchParams({
        name: stop,
      }),
    {
      headers: {
        Accept: "application/json",
      },
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
  fetch(`api/stations`, {
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
  fetch(`api/stations/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject("Failed to delete station!");
    });

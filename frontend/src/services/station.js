const PATH = 'api/stations';

export const getStations = () =>
  fetch(`${PATH}`, {
    headers: {
      Accept: 'application/json'
    }
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to fetch stations!');
    });

export const getStationDepartures = (id, date, time) =>
  fetch(
    `${PATH}/${id}/departures?` +
      new URLSearchParams({
        date,
        time
      }),
    {
      headers: {
        Accept: 'application/json'
      }
    }
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to fetch departures!');
    });

export const searchStations = (stop) =>
  fetch(
    `${PATH}/search?` +
      new URLSearchParams({
        name: stop
      }),
    {
      headers: {
        Accept: 'application/json'
      }
    }
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to fetch stations!');
    });

export const createStation = (station) =>
  fetch(`${PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(station)
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to save station!');
    });

export const deleteStation = (id) =>
  fetch(`${PATH}/${id}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to delete station!');
    });

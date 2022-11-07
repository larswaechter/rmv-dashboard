const PATH = 'api/alarms';

export const getAlarms = () =>
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
      return Promise.reject('Failed to fetch alarms!');
    });

export const getAlarmDetails = (id) =>
  fetch(`${PATH}/${id}/details`, {
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
      return Promise.reject('Failed to fetch alarm details!');
    });

export const createAlarm = (alarm) =>
  fetch(`${PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(alarm)
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to save alarm!');
    });

export const deleteAlarm = (id) =>
  fetch(`${PATH}/${id}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to delete alarm!');
    });

export const pauseAlarm = (id) =>
  fetch(`${PATH}/${id}/pause`, {
    method: 'PATCH'
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to pause alarm!');
    });

export const resumeAlarm = (id) =>
  fetch(`${PATH}/${id}/resume`, {
    method: 'PATCH'
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to resume alarm!');
    });

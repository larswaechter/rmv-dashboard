export const getAlarms = () =>
  fetch(`api/alarms`, {
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
      return Promise.reject("Failed to fetch alarms!");
    });

export const getAlarmDetails = (id) =>
  fetch(`api/alarms/${id}/details`, {
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
      return Promise.reject("Failed to fetch alarm details!");
    });

export const createAlarm = (alarm) =>
  fetch(`api/alarms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alarm),
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject("Failed to save alarm!");
    });

export const deleteAlarm = (id) =>
  fetch(`api/alarms/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject("Failed to delete alarm!");
    });

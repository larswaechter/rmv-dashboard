export const getAlarms = () =>
  fetch(`api/delay-alarms`, {
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
      return Promise.reject("Failed to fetch delay alarms!");
    });

export const getAlarmDetails = (id) =>
  fetch(`api/delay-alarms/${id}/details`, {
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
      return Promise.reject("Failed to fetch delay alarm details!");
    });

export const createAlarm = (alarm) =>
  fetch(`api/delay-alarms`, {
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
      return Promise.reject("Failed to save delay alarm!");
    });

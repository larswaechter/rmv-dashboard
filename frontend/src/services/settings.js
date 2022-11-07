const PATH = 'api/settings';

export const getSettings = () =>
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
      return Promise.reject('Failed to fetch settings!');
    });

export const updateSetting = (key, value) =>
  fetch(`${PATH}/${key}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value })
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to update setting!');
    });

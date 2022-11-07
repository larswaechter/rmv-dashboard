const headers = {
  Accept: 'application/json'
};

export const searchJourney = (id) =>
  fetch(
    `api/journeys/search?` +
      new URLSearchParams({
        id
      }),
    {
      headers
    }
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Failed to fetch journey!');
    });

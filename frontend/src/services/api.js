const BASE_URL = "http://localhost:8080";
const headers = {
  Accept: "application/json",
};

export const getArrivals = (stop) =>
  fetch(`${BASE_URL}/boards/arrival`, {
    headers,
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
      Promise.reject("Failed to fetch arrivals");
    });

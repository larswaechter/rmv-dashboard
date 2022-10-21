import { orange, green, red, deepOrange } from "@mui/material/colors";

export const parseDateTime = (date, time) => {
  const [arrYear, arrMonth, arrDay] = date.split("-");
  const [arrHours, arrMin, arrSec] = time.split(":");

  return new Date(
    +arrYear,
    +arrMonth - 1,
    +arrDay,
    +arrHours,
    +arrMin,
    +arrSec
  );
};

export const addLeadingZero = (val) => (val < 10 ? `0${val}` : val);

export const delayToColor = (delaySec) => {
  if (delaySec < 5) return green[500];
  if (delaySec < 10) return orange[500];
  if (delaySec < 20) return deepOrange[500];
  return red[500];
};

export const hasStopDelay = (stop) => {
  return (
    stop.arrival.date.original ||
    stop.arrival.time.original ||
    stop.departure.date.original ||
    stop.departure.date.time
  );
};

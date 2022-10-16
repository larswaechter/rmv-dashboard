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

export const getDateDiffInSec = (start, end) => (end - start) / 1000 / 60;

export const getDelayInSeconds = (date, time) => {
  if (!date.changed && !time.changed) return 0;

  const dateOriginal = date.changed ? date.original : date.value;
  const timeOriginal = time.changed ? time.original : time.value;

  const datePlan = date.value;
  const timePlan = time.value;

  return getDateDiffInSec(
    parseDateTime(dateOriginal, timeOriginal),
    parseDateTime(datePlan, timePlan)
  );
};

export const delayToColor = (delaySec) => {
  if (delaySec < 5) return green[500];
  if (delaySec < 10) return orange[500];
  if (delaySec < 20) return deepOrange[500];
  return red[500];
};

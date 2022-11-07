import { orange, green, red, deepOrange } from '@mui/material/colors';

export const parseDateTime = (date, time) => {
  const [arrYear, arrMonth, arrDay] = date.split('-');
  const [arrHours, arrMin, arrSec] = time.split(':');

  return new Date(+arrYear, +arrMonth - 1, +arrDay, +arrHours, +arrMin, +arrSec);
};

export const delayToColor = (delaySec) => {
  if (delaySec < 5) return green[500];
  if (delaySec < 10) return orange[500];
  if (delaySec < 20) return deepOrange[500];
  return red[500];
};

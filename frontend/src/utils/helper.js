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

export const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

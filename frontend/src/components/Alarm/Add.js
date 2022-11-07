import { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { searchJourney } from '../../services/journey';
import { createAlarm } from '../../services/alarm';
import { ModalStyle } from '../../utils/helper';

const AlarmAdd = ({ handleClose }) => {
  const [stop, setStop] = useState('');
  const [stops, setStops] = useState([]);
  const [autodelete, setAutodelete] = useState(true);
  const [silent, setSilent] = useState(true);
  const [series, setSeries] = useState(false);
  const [interval, setInterval] = useState(1);

  const [telegram, setTelegram] = useState(false);
  const [discord, setDiscord] = useState(false);
  const [journeyRef, setJourneyRef] = useState('');

  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!journeyRef || !stop) return;
      const newAlarm = await createAlarm({
        journeyRef,
        stationId: stop,
        interval: series ? interval : 0,
        silent,
        autodelete,
        telegram,
        discord
      });
      handleClose(newAlarm);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setJourneyRef(e.target.value);
    setStop('');
    setStops([]);
  };

  const search = async () => {
    if (!journeyRef) return;

    try {
      const data = await searchJourney(journeyRef);
      if (data.stops)
        setStops(
          data.stops.map(({ id, name }) => ({
            id,
            name
          }))
        );
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <Box sx={ModalStyle} component="form" onSubmit={handleSave}>
      <Typography variant="h6" component="h2" marginBottom={'16px'}>
        Add alarm
      </Typography>
      <Stack spacing={2}>
        <TextField
          required
          id="outlined-basic"
          label="JourneyRef"
          variant="outlined"
          value={journeyRef}
          onBlur={search}
          onChange={handleInputChange}
        />

        {stops.length > 0 && (
          <FormControl fullWidth>
            <InputLabel id="stops">Stops</InputLabel>
            <Select
              required
              labelId="stops"
              id="demo-simple-select"
              value={stop}
              label="Stops"
              onChange={(e) => setStop(e.target.value)}
            >
              {stops.map((stop) => (
                <MenuItem key={stop.id} value={stop.id}>
                  {stop.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormGroup>
          <Typography variant="subtitle1" gutterBottom>
            Options
          </Typography>
          <FormControlLabel
            control={<Switch checked={silent} onChange={(e) => setSilent(e.target.checked)} />}
            label="Silent"
            title="Receive updates only on changes"
          />
          <FormControlLabel
            control={<Switch checked={series} onChange={(e) => setSeries(e.target.checked)} />}
            label="Series"
            title="Repeart for future similar journeys"
          />
          {series && (
            <TextField
              required
              id="interval"
              label="Day Interval"
              variant="outlined"
              value={interval}
              onChange={(e) => setInterval(+e.target.value)}
              size="small"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 7 } }}
              sx={{ marginY: 2 }}
            />
          )}

          <FormControlLabel
            control={
              <Switch checked={autodelete} onChange={(e) => setAutodelete(e.target.checked)} />
            }
            label="Autodelete"
            title="Delete alarm after departure"
          />
        </FormGroup>

        <FormGroup>
          <Typography variant="subtitle1" gutterBottom>
            Bots
          </Typography>
          <FormControlLabel
            control={<Switch checked={discord} onChange={(e) => setDiscord(e.target.checked)} />}
            label="Discord"
          />
          <FormControlLabel
            control={<Switch checked={telegram} onChange={(e) => setTelegram(e.target.checked)} />}
            label="Telegram"
          />
        </FormGroup>

        {error && <Alert severity="error">{error}</Alert>}

        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: '4px' }} onClick={() => handleClose(false)}>
            Close
          </Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </div>
      </Stack>
    </Box>
  );
};

AlarmAdd.propTypes = {
  handleClose: PropTypes.func
};

export default AlarmAdd;

import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { searchJourney } from "../../services/journey";
import { createAlarm } from "../../services/alarm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AlarmAdd = ({ handleClose }) => {
  const [stop, setStop] = useState("");
  const [stops, setStops] = useState([]);
  const [autoremove, setAutoremove] = useState(true);
  const [journeyRef, setJourneyRef] = useState("");

  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!journeyRef || !stop) return;
      const newAlarm = await createAlarm({
        journeyRef,
        station_id: stop,
        autoremove,
      });
      handleClose(newAlarm);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setJourneyRef(e.target.value);
    setStop("");
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
            name,
          }))
        );
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <Box sx={style} component="form" onSubmit={handleSave}>
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        marginBottom={"16px"}
      >
        Add alarm
      </Typography>
      <Stack spacing={4}>
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
            <InputLabel id="demo-simple-select-label">Stops</InputLabel>
            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stop}
              label="Stops"
              onChange={(e) => {
                setStop(e.target.value);
              }}
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
          <FormControlLabel
            control={
              <Switch
                checked={autoremove}
                onChange={(e) => setAutoremove(e.target.checked)}
              />
            }
            label="Autoremove"
          />
        </FormGroup>

        {error && <Alert severity="error">{error}</Alert>}

        <div style={{ textAlign: "right" }}>
          <Button
            style={{ marginRight: "4px" }}
            onClick={() => handleClose(false)}
          >
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

export default AlarmAdd;
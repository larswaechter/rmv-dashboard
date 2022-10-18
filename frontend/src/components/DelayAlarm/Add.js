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

import { searchJourney } from "../../services/journey";
import { createAlarm } from "../../services/delayAlarm";

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

const DelayAlarmAdd = ({ handleClose }) => {
  const [stop, setStop] = useState("");
  const [stops, setStops] = useState([]);
  const [journeyRef, setJourneyRef] = useState("");

  const handleSave = async () => {
    try {
      if (!journeyRef || !stop) return;
      const newAlarm = await createAlarm({ journeyRef, station_id: stop });
      handleClose(newAlarm);
    } catch (err) {
      console.error(err);
    }
  };

  const search = async () => {
    if (!journeyRef) return;

    const data = await searchJourney(journeyRef);

    if (data.stops) {
      setStops(
        data.stops.map(({ id, name }) => ({
          id,
          name,
        }))
      );
    }

    console.log(data);
  };

  return (
    <Box sx={style} component="form">
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        marginBottom={"16px"}
      >
        Add delay ticker
      </Typography>
      <Stack spacing={4}>
        <TextField
          id="outlined-basic"
          label="JourneyRef"
          variant="outlined"
          value={journeyRef}
          onBlur={search}
          onChange={(e) => setJourneyRef(e.target.value)}
        />

        {stops.length > 0 && (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Stops</InputLabel>
            <Select
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

        <div style={{ textAlign: "right" }}>
          <Button
            style={{ marginRight: "4px" }}
            onClick={() => handleClose(false)}
          >
            Close
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Stack>
    </Box>
  );
};

export default DelayAlarmAdd;

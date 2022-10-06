import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import StationSearch from "./Search";
import { createStation } from "../../services/station";

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

const StationAdd = ({ handleClose }) => {
  const [station, setStation] = useState(null);

  const handleSave = async () => {
    try {
      if (!station) return;
      await createStation(station);
      handleClose(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={style} component="form">
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        marginBottom={"16px"}
      >
        Add station
      </Typography>
      <Stack spacing={4}>
        <StationSearch handleChange={setStation} />
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

export default StationAdd;

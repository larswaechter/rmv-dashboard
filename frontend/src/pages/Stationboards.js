import * as React from "react";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import Stationboard from "../components/Stationboard";

const PagesStationboards = () => {
  return (
    <div className="PagesStationboards">
      <Typography variant="h5" component="h1" marginBottom={"8px"}>
        Stationboard
      </Typography>
      <Stationboard />
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", bottom: 32, right: 32 }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default PagesStationboards;

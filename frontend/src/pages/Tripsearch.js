import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Card from "../components/Card";

const PagesTripsearch = () => {
  return (
    <div className="PagesTripsearch">
      <Typography variant="h5" component="h1" marginBottom={"8px"}>
        Trip Search
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card />
          </Grid>
          <Grid item xs={4}>
            <Card />
          </Grid>
          <Grid item xs={4}>
            <Card />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default PagesTripsearch;

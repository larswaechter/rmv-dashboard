const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const tripRouter = require("./routes/trip");
const locationRouter = require("./routes/location");
const stationboardsRouter = require("./routes/stationboard");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "DELETE"],
  })
);
app.use(helmet());
app.use("/stationboards", stationboardsRouter);
app.use("/trips", tripRouter);
app.use("/locations", locationRouter);

module.exports = app;

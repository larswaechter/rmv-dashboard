const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { json } = require("express");

const boardsRouter = require("./components/boards/routes");
const journeysRouter = require("./components/journeys/routes");
const stationsRouter = require("./components/stations/routes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "DELETE"],
  })
);
app.use(helmet());
app.use(json());

// Routes
app.use("/boards/", boardsRouter);
app.use("/journeys/", journeysRouter);
app.use("/stations/", stationsRouter);

module.exports = app;

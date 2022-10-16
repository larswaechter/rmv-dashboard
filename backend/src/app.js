const express = require("express");
const helmet = require("helmet");
const { join } = require("path");
const { json } = require("express");

const journeysRouter = require("./components/journeys/routes");
const stationsRouter = require("./components/stations/routes");

const app = express();

// Middleware
app.use(helmet());
app.use(json());

app.use(express.static(join(__dirname, "/../../public")));

app.get(/^\/(?!api)/, (req, res) => {
  res.sendFile(join(__dirname, "../../public", "index.html"));
});

// Routes
app.use("/api/journeys/", journeysRouter);
app.use("/api/stations/", stationsRouter);

module.exports = app;

const express = require("express");
const helmet = require("helmet");
const { join } = require("path");
const { json } = require("express");
const { v4 } = require("uuid");

const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 3001 });

const app = express();

const journeysRouter = require("./components/journeys/routes");
const stationsRouter = require("./components/stations/routes");
const alarmsRouter = require("./components/alarms/routes");
const logger = require("./config/logger");

// Middleware

app.use(helmet());
app.use(json());

app.use(express.static(join(__dirname, "/../../public")));

app.get(/^\/(?!api)/, (req, res) => {
  res.sendFile(join(__dirname, "../../public", "index.html"));
});

const wsClients = new Map();

// Routes
app.use("/api/journeys/", journeysRouter);
app.use("/api/stations/", stationsRouter);
app.use("/api/alarms/", alarmsRouter);

wss.on("connection", function connection(ws) {
  logger.debug("Client connected to WS");

  const uuid = v4();
  wsClients.set(uuid, ws);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.on("close", () => {
    wsClients.delete(ws);
  });

  ws.send(uuid);
});

module.exports = app;

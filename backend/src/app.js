const express = require("express");
const helmet = require("helmet");
const { join } = require("path");
const { json } = require("express");
const { WebSocketServer } = require("ws");

const logger = require("./config/logger");
const journeysRouter = require("./components/journeys/routes");
const stationsRouter = require("./components/stations/routes");
const alarmsRouter = require("./components/alarms/routes");

const app = express();
const server = require("http").createServer(app);

const wsserver = new WebSocketServer({ path: "/websocket", server });

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
app.use("/api/alarms/", alarmsRouter);

wsserver.on("connection", function connection(ws) {
  logger.debug("[WS] Client connected");

  ws.on("message", function message(data) {
    logger.debug("[WS] Received: %s", data);
  });

  ws.on("close", () => {
    logger.debug("[WS] Client disconnected");
  });
});

module.exports = { server, wsserver };

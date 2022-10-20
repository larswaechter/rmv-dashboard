import express from "express";
import helmet from "helmet";
import { join } from "path";
import { json } from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import logger from "./config/logger";

import journeysRouter from "./components/journeys/routes";
import stationsRouter from "./components/stations/routes";
import alarmsRouter from "./components/alarms/routes";

const app = express();
export const server = createServer(app);

export const wsserver = new WebSocketServer({ path: "/websocket", server });

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

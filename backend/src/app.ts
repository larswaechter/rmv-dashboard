import express from "express";
import helmet from "helmet";
import { join } from "path";
import { json } from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import Logger from "./config/logger";

import journeysRouter from "./components/journeys/routes";
import stationsRouter from "./components/stations/routes";
import alarmsRouter from "./components/alarms/routes";
import settingsRouter from "./components/settings/routes";

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
app.use("/api/settings/", settingsRouter);

wsserver.on("connection", function connection(ws) {
  Logger.debug("[WS] Client connected");

  ws.on("message", function message(data) {
    Logger.debug("[WS] Received: %s", data);
  });

  ws.on("close", () => {
    Logger.debug("[WS] Client disconnected");
  });
});

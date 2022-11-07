import express from 'express';
import helmet from 'helmet';
import { join } from 'path';
import { json } from 'express';
import { WebSocketServer } from 'ws';

import Logger from './config/logger';

import journeysRouter from './components/journeys/routes';
import stationsRouter from './components/stations/routes';
import alarmsRouter from './components/alarms/routes';
import settingsRouter from './components/settings/routes';

export class Server {
  private readonly _app: express.Application = express();
  private static _wss: WebSocketServer;

  constructor() {
    this.registerMiddleware();
    this.registerRoutes();
  }

  get app(): express.Application {
    return this._app;
  }

  static get wss(): WebSocketServer {
    return Server._wss;
  }

  static set wss(wss: WebSocketServer) {
    Server._wss = wss;
    Server._wss.on('connection', function connection(ws) {
      Logger.debug('[WS] Client connected');

      ws.on('message', function message(data) {
        Logger.debug('[WS] Received: %s', data);
      });

      ws.on('close', () => {
        Logger.debug('[WS] Client disconnected');
      });
    });
  }

  private registerMiddleware() {
    this._app.use(helmet());
    this._app.use(json());
    this._app.use(express.static(join(__dirname, '/../../public')));
  }

  private registerRoutes() {
    this._app.get(/^\/(?!api)/, (req, res) => {
      res.sendFile(join(__dirname, '../../public', 'index.html'));
    });

    this._app.use('/api/journeys/', journeysRouter);
    this._app.use('/api/stations/', stationsRouter);
    this._app.use('/api/alarms/', alarmsRouter);
    this._app.use('/api/settings/', settingsRouter);
  }
}

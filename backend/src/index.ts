import { config } from 'dotenv';
import { install } from 'source-map-support';

config();
install();

import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { Server } from './server';
import db from './config/db';
import Logger from './config/logger';

db.authenticate()
  .then(() => {
    db.sync()
      .then(() => {
        const server = new Server();
        const httpServer = createServer(server.app);

        Server.wss = new WebSocketServer({
          path: '/websocket',
          server: httpServer
        });

        httpServer.listen(5000, () => {
          require('./services/cronjob');
          Logger.info('rmv-backend is listening on port 5000');
        });
      })
      .catch((err) => {
        Logger.error(err);
      });
  })
  .catch((err) => {
    Logger.error(err);
  });

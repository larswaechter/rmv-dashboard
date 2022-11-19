import { config } from 'dotenv';
import { Queue } from 'bullmq';
import { install } from 'source-map-support';

config();
install();

import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { Server } from './server';
import db from './config/db';
import Logger from './config/logger';

const redisConfiguration = {
  connection: {
    host: 'localhost',
    port: 6379
  }
};

const myQueue = new Queue('emailSchedule', redisConfiguration);

myQueue.add('email', { email: 'lars@mail.com', mesage: 'hello world' }, { delay: 2000 });

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

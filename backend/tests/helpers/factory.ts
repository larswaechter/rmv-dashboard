import { config } from 'dotenv';
import { install } from 'source-map-support';

config();
install();

process.env.DB_NAME = 'db.test.sqlite';

import supertest from 'supertest';
import { createServer, Server as HttpServer } from 'http';

import { Server } from '../../src/server';
import db from '../../src/config/db';

export class TestFactory {
  private readonly server: Server;
  private readonly http: HttpServer;

  constructor() {
    this.server = new Server();
    this.http = createServer(this.server.app);
  }

  get app() {
    return supertest(this.server.app);
  }

  dummyAlarm = {
    journeyRef: 'MyJourneyRef',
    stationId: 'MyStationID',
    silent: false,
    interval: 5,
    autoremove: false,
    telegram: false,
    discord: false,
    paused: false,
    active: false
  };

  dummyStation = {
    name: 'Frankfurt Hauptbahnhof',
    stationId: 'MyStationID'
  };

  dummySetting = {
    key: 'MY_KEY',
    value: 'HelloWorld',
    default: 'MyDefaultVal',
    description: 'This is a description',
    group: 'testing'
  };

  prepare(cb: (err?: Error) => void) {
    db.authenticate()
      .then(() => {
        db.sync()
          .then(() => {
            this.http.listen(process.env.NODE_PORT, cb);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  close(cb: (err?: Error) => void) {
    this.http.close((err) => {
      cb(err);
    });
  }
}

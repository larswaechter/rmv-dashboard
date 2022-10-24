require("dotenv").config();
require("source-map-support").install();

process.env.DB_NAME = "db.test.sqlite";

import supertest from "supertest";
import { createServer, Server as HttpServer } from "http";

import { Server } from "../../src/server";
import db from "../../src/config/db";
import { Alarm } from "../../src/components/alarms/model";

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
    journeyRef: "MyJourneyRef",
    station_id: "MyStationID",
    smartmode: false,
    interval: 5,
    autoremove: false,
    telegram: false,
    discord: false,
    active: false,
  };

  dummyStation = {
    name: "Frankfurt Hauptbahnhof",
    station_id: "MyStationID",
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

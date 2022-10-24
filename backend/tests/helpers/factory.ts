require("dotenv").config();
require("source-map-support").install();

process.env.DB_NAME = "db.test.sqlite";

import supertest from "supertest";
import { createServer, Server as HttpServer } from "http";

import { Server } from "../../src/server";
import sequelize from "../../src/config/db";

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

  prepare(cb: (err?: Error) => void) {
    sequelize
      .authenticate()
      .then(() => {
        this.http.listen(process.env.NODE_PORT, cb);
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

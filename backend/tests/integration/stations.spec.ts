import { expect } from "chai";

import Station from "../../src/components/stations/model";
import { TestFactory } from "../helpers/factory";

describe("Stations component", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll((done) => {
    factory.prepare(done);
  });

  afterAll((done) => {
    factory.close(done);
  });

  it("GET /api/stations", (done) => {
    factory.app
      .get("/api/stations")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        const stations = res.body;

        expect(stations).to.be.an("array");
        expect(stations.length).eq(0);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("POST /api/stations", (done) => {
    factory.app
      .post("/api/stations")
      .send(factory.dummyStation)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        const station: Station = res.body;

        expect(station).to.be.an("object");
        expect(station.id).eq(1);
        expect(station.name).eq(factory.dummyStation.name);
        expect(station.station_id).eq(factory.dummyStation.station_id);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("GET /api/stations", (done) => {
    factory.app
      .get("/api/stations")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        const stations: Station[] = res.body;

        expect(stations).to.be.an("array");
        expect(stations).to.have.length(1);
        expect(stations[0]).to.be.an("object");
        expect(stations[0].id).eq(1);
        expect(stations[0].name).eq(factory.dummyStation.name);
        expect(stations[0].station_id).eq(factory.dummyStation.station_id);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("GET /api/stations/1", (done) => {
    factory.app
      .get("/api/stations/1")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        const station: Station = res.body;

        expect(station).to.be.an("object");
        expect(station.id).eq(1);
        expect(station.name).eq(factory.dummyStation.name);
        expect(station.station_id).eq(factory.dummyStation.station_id);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("DELETE /api/stations/1", (done) => {
    factory.app.delete("/api/stations/1").expect(201);
    done();
  });
});

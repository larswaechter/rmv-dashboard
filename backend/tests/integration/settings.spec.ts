import { expect } from "chai";
import Settings from "../../src/components/settings/model";

import { TestFactory } from "../helpers/factory";

describe("Settings component", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll((done) => {
    factory.prepare(done);
  });

  afterAll((done) => {
    factory.close(done);
  });

  it("GET /api/settings", (done) => {
    factory.app
      .get("/api/settings")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        const alarms = res.body;

        expect(alarms).to.be.an("array");
        expect(alarms.length).eq(0);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("GET /api/settings/RANDOM_KEY", (done) => {
    factory.app
      .get("/api/settings/RANDOM_KEY")
      .expect(404)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("POST /api/settings", (done) => {
    factory.app
      .post("/api/settings")
      .send(factory.dummySetting)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        const setting: Settings = res.body;

        expect(setting).to.be.an("object");
        expect(setting.id).eq(1);
        expect(setting.key).eq(factory.dummySetting.key);
        expect(setting.value).eq(factory.dummySetting.value);
        expect(setting.default).eq(factory.dummySetting.default);
        expect(setting.description).eq(factory.dummySetting.description);
        expect(setting.group).eq(factory.dummySetting.group);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`PATCH /api/settings/${factory.dummySetting.key}`, (done) => {
    factory.app
      .patch(`/api/settings/${factory.dummySetting.key}`)
      .send({})
      .expect(400)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`PATCH /api/settings/${factory.dummySetting.key}`, (done) => {
    factory.app
      .patch(`/api/settings/${factory.dummySetting.key}`)
      .send({
        value: "NewValue",
      })
      .expect(204)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`PATCH /api/settings/RANDOM_KEY`, (done) => {
    factory.app
      .patch(`/api/settings/RANDOM_KEY`)
      .send({
        value: "NewValue",
      })
      .expect(404)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`GET /api/settings/${factory.dummySetting.key}`, (done) => {
    factory.app
      .get(`/api/settings/${factory.dummySetting.key}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        const setting: Settings = res.body;

        expect(setting).to.be.an("object");
        expect(setting.value).eq("NewValue");

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

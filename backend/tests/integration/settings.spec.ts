import { expect } from "chai";

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
});

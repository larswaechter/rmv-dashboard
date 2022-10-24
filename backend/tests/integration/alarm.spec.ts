import { expect } from "chai";
import { TestFactory } from "../helpers/factory";

describe("Alarm component", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll((done) => {
    factory.prepare(done);
  });

  afterAll((done) => {
    factory.close(done);
  });

  it("GET /api/alarms", (done) => {
    factory.app
      .get("/api/alarms")
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

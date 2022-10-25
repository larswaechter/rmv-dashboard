import { TestFactory } from "../helpers/factory";

describe("Journeys component", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll((done) => {
    factory.prepare(done);
  });

  afterAll((done) => {
    factory.close(done);
  });

  it("GET /api/journeys/search", (done) => {
    factory.app
      .get("/api/journeys/search")
      .expect(400)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

import { TestFactory } from "../helpers/factory";

describe("Journeys component", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll((done) => {
    factory.prepare(done);
  });

  afterAll((done) => {
    factory.close(done);
  });

  it("GET /api/journeys", () => {
    factory.app.get("/api/journeys").expect(400);
  });
});

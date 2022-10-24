import { expect } from "chai";
import { readFileSync } from "fs";
import { join } from "path";

import {
  IJourneyDetails,
  Journey,
} from "../../../src/components/rmv/models/Journey";
import { Product } from "../../../src/components/rmv/models/Product";
import { Stop } from "../../../src/components/rmv/models/Stop";

describe("Journey model", () => {
  const data: IJourneyDetails = JSON.parse(
    readFileSync(join(__dirname, "data.json"), {
      encoding: "utf-8",
    })
  );

  it("ofJourneyDetails", (done) => {
    const journey = Journey.ofJourneyDetails(data);
    expect(journey.stops).to.have.length(5);
    expect(journey.journeyStatus).to.eq("P");
    expect(journey.reachable).to.eq(true);

    expect(journey.products).to.have.length(1);
    expect(journey.products[0]).to.instanceOf(Product);
    expect(journey.products[0].name).to.eq(data.Product[0].name);
    expect(journey.products[0].internalName).to.eq(
      data.Product[0].internalName
    );
    expect(journey.products[0].displayNumber).to.eq(
      data.Product[0].displayNumber
    );
    expect(journey.products[0].catCode).to.eq(data.Product[0].catCode);
    expect(journey.products[0].catOut).to.eq(data.Product[0].catOut);

    expect(journey.directions).to.have.length(1);
    expect(journey.directions[0].value).to.equal(
      data.Directions.Direction[0].value
    );
    expect(journey.directions[0].flag).to.equal(
      data.Directions.Direction[0].flag
    );
    expect(journey.directions[0].routeIdxFrom).to.equal(
      data.Directions.Direction[0].routeIdxFrom
    );
    expect(journey.directions[0].routeIdxTo).to.equal(
      data.Directions.Direction[0].routeIdxTo
    );

    done();
  });

  it("getStopByID", (done) => {
    const src = data.Stops.Stop[0];
    const journey = Journey.ofJourneyDetails(data);

    const stop = journey.getStopByID(src.id);

    expect(stop).to.instanceOf(Stop);
    expect(stop.index).to.eq(src.routeIdx);
    expect(stop.name).to.eq(src.name);

    done();
  });

  it("getNextStop", (done) => {
    const journey = Journey.ofJourneyDetails(data);
    const date = new Date(2022, 9, 19, 8, 27);
    expect(journey.getNextStopIdx(date)).to.eq(2);

    done();
  });
});

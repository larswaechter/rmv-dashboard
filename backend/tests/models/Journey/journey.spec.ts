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
    expect(journey.products[0].name).to.eq("RE30");
    expect(journey.products[0].internalName).to.eq("RE30");
    expect(journey.products[0].displayNumber).to.eq("RE30");
    expect(journey.products[0].catCode).to.eq("2");
    expect(journey.products[0].catOut).to.eq("RE");

    expect(journey.directions).to.have.length(1);
    expect(journey.directions[0].value).to.equal(
      "Frankfurt (Main) Hauptbahnhof"
    );
    expect(journey.directions[0].flag).to.equal("1");
    expect(journey.directions[0].routeIdxFrom).to.equal(0);
    expect(journey.directions[0].routeIdxTo).to.equal(4);

    done();
  });

  it("getStopByID", (done) => {
    const journey = Journey.ofJourneyDetails(data);
    const stop = journey.getStopByID(
      "A=1@O=Frankfurt (Main) Westbahnhof@X=8639452@Y=50119447@U=80@L=3001204@"
    );

    expect(stop).to.instanceOf(Stop);
    expect(stop.index).to.eq(3);
    expect(stop.name).to.eq("Frankfurt (Main) Westbahnhof");

    done();
  });

  it("getNextStop", (done) => {
    const journey = Journey.ofJourneyDetails(data);
    const date = new Date(2022, 9, 19, 8, 27);
    expect(journey.getNextStopIdx(date)).to.eq(2);

    done();
  });
});

import { expect } from "chai";
import { readFileSync } from "fs";
import { join } from "path";
import {
  Departure,
  IDepartureBoard,
} from "../../../src/components/rmv/models/Departure";
import { Product } from "../../../src/components/rmv/models/Product";

describe("Departure model", () => {
  const data: IDepartureBoard = JSON.parse(
    readFileSync(join(__dirname, "data.json"), {
      encoding: "utf-8",
    })
  );

  it("ofResponse", (done) => {
    const src = data.Departure[0];
    const departure = Departure.ofResponse(src);

    expect(departure.journeyStatus).to.eq("P");
    expect(departure.journeyRef).to.eq(src.JourneyDetailRef.ref);

    expect(departure.direction).to.eq(src.direction);
    expect(departure.name).to.eq(src.name);

    expect(departure.stationId).to.eq(src.stopid);

    expect(departure.products).to.have.length(1);
    expect(departure.products[0]).to.instanceOf(Product);
    expect(departure.products[0].name).to.eq(src.Product[0].name);
    expect(departure.products[0].internalName).to.eq(
      src.Product[0].internalName
    );
    expect(departure.products[0].displayNumber).to.eq(
      src.Product[0].displayNumber
    );
    expect(departure.products[0].catCode).to.eq(src.Product[0].catCode);
    expect(departure.products[0].catOut).to.eq(src.Product[0].catOut);

    expect(departure.departure.date.value).to.eq(src.rtDate);
    expect(departure.departure.date.original).to.be.undefined;
    expect(departure.departure.time.value).to.eq(src.rtTime);
    expect(departure.departure.time.original).to.eq(src.time);

    expect(departure.departure.delay).to.eq(4);
    expect(departure.departure.track.value).to.eq(src.rtTrack);
    expect(departure.departure.track.original).to.be.undefined;

    const { date, time } = departure.getOriginalDepartureTime();
    expect(date).to.eq("2022-10-24");
    expect(time).to.eq("19:11:00");

    done();
  });
});

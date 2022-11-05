import { expect } from "chai";
import { readFileSync } from "fs";
import { join } from "path";

import { IStop, Stop } from "../../../src/components/rmv/models/Stop";

describe("Stop model", () => {
  const data: IStop[] = JSON.parse(
    readFileSync(join(__dirname, "data.json"), {
      encoding: "utf-8",
    })
  );

  it("ofResponse[0]", (done) => {
    const src = data[0];
    const stop = Stop.ofResponse(data[0], data.length);

    expect(stop.id).to.eq(src.id);
    expect(stop.index).to.eq(0);
    expect(stop.isFirst).to.be.true;
    expect(stop.isLast).to.be.false;

    expect(stop.lat).to.eq(src.lat);
    expect(stop.lon).to.eq(src.lon);

    expect(stop.arrival).to.be.undefined;

    expect(stop.departure.delay).to.eq(0);
    expect(stop.departure.date.original).to.be.undefined;
    expect(stop.departure.date.value).to.eq(src.depDate);
    expect(stop.departure.time.original).to.be.undefined;
    expect(stop.departure.time.value).to.eq(src.depTime);
    expect(stop.departure.track.original).to.be.undefined;
    expect(stop.departure.track.value).to.eq(src.depTrack);

    expect(stop.getOriginalDateTimeOrFallback().date).to.eq(src.depDate);
    expect(stop.getOriginalDateTimeOrFallback().time).to.eq(src.depTime);

    expect(stop.departureDir).to.eq(src.depDir);

    expect(stop.hasArrivalDelay()).to.be.false;
    expect(stop.hasDepartureDelay()).to.be.false;
    expect(stop.hasDelay()).to.be.false;

    expect(stop.hasArrivalTrackChange()).to.be.false;
    expect(stop.hasDepartureTrackChange()).to.be.false;
    expect(stop.hasTrackChange()).to.be.false;

    expect(stop.hasScheduleChange()).to.be.false;
    expect(stop.wasReached()).to.be.true;

    done();
  });

  it("ofResponse[1]", (done) => {
    const src = data[1];
    const stop = Stop.ofResponse(data[1], data.length);

    expect(stop.id).to.eq(src.id);
    expect(stop.index).to.eq(1);
    expect(stop.isFirst).to.be.false;
    expect(stop.isLast).to.be.false;

    expect(stop.lat).to.eq(src.lat);
    expect(stop.lon).to.eq(src.lon);

    expect(stop.arrival.delay).to.eq(0);
    expect(stop.arrival.date.original).to.be.undefined;
    expect(stop.arrival.date.value).to.eq(src.arrDate);
    expect(stop.arrival.time.original).to.be.undefined;
    expect(stop.arrival.time.value).to.eq(src.arrTime);
    expect(stop.arrival.track.original).to.be.undefined;
    expect(stop.arrival.track.value).to.eq(src.arrTrack);

    expect(stop.departure.delay).to.eq(0);
    expect(stop.departure.date.original).to.be.undefined;
    expect(stop.departure.date.value).to.eq(src.depDate);
    expect(stop.departure.time.original).to.be.undefined;
    expect(stop.departure.time.value).to.eq(src.depTime);
    expect(stop.departure.track.original).to.be.undefined;
    expect(stop.departure.track.value).to.eq(src.depTrack);

    expect(stop.getOriginalDateTimeOrFallback().date).to.eq(src.depDate);
    expect(stop.getOriginalDateTimeOrFallback().time).to.eq(src.depTime);

    expect(stop.departureDir).to.eq(src.depDir);

    expect(stop.hasArrivalDelay()).to.be.false;
    expect(stop.hasDepartureDelay()).to.be.false;
    expect(stop.hasDelay()).to.be.false;

    expect(stop.hasArrivalTrackChange()).to.be.false;
    expect(stop.hasDepartureTrackChange()).to.be.false;
    expect(stop.hasTrackChange()).to.be.false;

    expect(stop.hasScheduleChange()).to.be.false;
    expect(stop.wasReached()).to.be.true;

    done();
  });

  it("ofResponse[2]", (done) => {
    const src = data[2];
    const stop = Stop.ofResponse(data[2], data.length);

    expect(stop.id).to.eq(src.id);
    expect(stop.index).to.eq(2);
    expect(stop.isFirst).to.be.false;
    expect(stop.isLast).to.be.false;

    expect(stop.lat).to.eq(src.lat);
    expect(stop.lon).to.eq(src.lon);

    expect(stop.arrival.delay).to.eq(3);
    expect(stop.arrival.date.original).to.be.undefined;
    expect(stop.arrival.date.value).to.eq(src.arrDate);
    expect(stop.arrival.time.original).to.eq(src.arrTime);
    expect(stop.arrival.time.value).to.eq(src.rtArrTime);
    expect(stop.arrival.track.original).to.eq(src.arrTrack);
    expect(stop.arrival.track.value).to.eq(src.rtArrTrack);

    expect(stop.departure.delay).to.eq(7);
    expect(stop.departure.date.original).to.be.undefined;
    expect(stop.departure.date.value).to.eq(src.depDate);
    expect(stop.departure.time.original).to.eq(src.depTime);
    expect(stop.departure.time.value).to.eq(src.rtDepTime);
    expect(stop.departure.track.original).to.eq(src.depTrack);
    expect(stop.departure.track.value).to.eq(src.rtDepTrack);

    expect(stop.getOriginalDateTimeOrFallback().date).to.eq(src.depDate);
    expect(stop.getOriginalDateTimeOrFallback().time).to.eq(src.depTime);

    expect(stop.departureDir).to.eq(src.depDir);

    expect(stop.hasArrivalDelay()).to.be.true;
    expect(stop.hasDepartureDelay()).to.be.true;
    expect(stop.hasDelay()).to.be.true;

    expect(stop.hasArrivalTrackChange()).to.be.true;
    expect(stop.hasDepartureTrackChange()).to.be.true;
    expect(stop.hasTrackChange()).to.be.true;

    expect(stop.hasScheduleChange()).to.be.true;
    expect(stop.wasReached()).to.be.false;

    done();
  });
});

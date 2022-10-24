import { expect } from "chai";
import { readFileSync } from "fs";
import { join } from "path";

import { IStation, Station } from "../../../src/components/rmv/models/Station";

describe("Station model", () => {
  const data: IStation = JSON.parse(
    readFileSync(join(__dirname, "data.json"), {
      encoding: "utf-8",
    })
  );

  it("ofResponse", (done) => {
    const station = Station.ofResponse(
      data.stopLocationOrCoordLocation[0].StopLocation
    );
    expect(station.name).to.eq("Butzbach Bahnhof");
    expect(station.stationId).to.eq(
      "A=1@O=Butzbach Bahnhof@X=8669664@Y=50430752@U=80@L=3011133@B=1@p=1666375434@"
    );

    done();
  });
});

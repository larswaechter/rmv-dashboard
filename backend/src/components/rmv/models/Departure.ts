import { RealtimeValue, RTDate, Timeservice } from "../../../services/time";

export class Departure {
  name: string;
  direction: string;
  departure: RTDate;
  journeyRef: string;
  category: string;
  notes: string[];

  public static ofResponse(res: any): Departure {
    const departure = new Departure();
    departure.name = res.name;
    departure.direction = res.direction;

    departure.departure = Timeservice.buildRTDate(
      res.date,
      res.rtDate,
      res.time,
      res.rtTime,
      res.track,
      res.rtTrack
    );

    departure.journeyRef = res.JourneyDetailRef.ref;
    departure.category = res.Product ? res.Product[0].catOut : "";

    return departure;
  }
}

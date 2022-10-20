import { RTDate, Timeservice } from "../../../services/time";
import { IJourneyDetailRef, IProduct } from "./Misc";

interface IDeparture {
  name: string;
  direction: string;
  date: string;
  rtDate: string;
  time: string;
  rtTime: string;
  track: string;
  rtTrack: string;
  JourneyDetailRef: IJourneyDetailRef;
  Product: IProduct[];
}

export interface IDepartureBoard {
  Departure?: IDeparture[];
}

export class Departure {
  name: string;
  direction: string;
  departure: RTDate;
  journeyRef: string;
  category: string;
  notes: string[];

  public static ofDepartureBoard(departureBoard: IDepartureBoard): Departure[] {
    if (departureBoard.Departure)
      return departureBoard.Departure.map((dep) => Departure.ofResponse(dep));
    return [];
  }

  public static ofResponse(res: IDeparture): Departure {
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

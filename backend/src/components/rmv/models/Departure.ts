import { RTSchedule, Timeservice } from "../../../services/time";

import { IProduct, Product } from "./Product";
import { IJourneyDetailRef, IMessage, INote } from "./Misc";

interface IDeparture {
  name: string;
  direction: string;
  stop: string;
  stopid: string;
  date: string;
  rtDate: string;
  time: string;
  rtTime: string;
  track: string;
  rtTrack: string;
  reachable: boolean;
  JourneyDetailRef: IJourneyDetailRef;
  JourneyStatus: string;
  Product: IProduct[];
  Messages: {
    Message: IMessage[];
  };
  Notes: {
    Note: INote[];
  };
}

export interface IDepartureBoard {
  Departure?: IDeparture[];
}

export class Departure {
  name: string;
  direction: string;
  departure: RTSchedule;
  products: Product[];
  journeyRef: string;
  journeyStatus: string;
  stationId: string;
  notes: string[];

  static ofDepartureBoard(departureBoard: IDepartureBoard): Departure[] {
    if (departureBoard.Departure)
      return departureBoard.Departure.map((dep) => Departure.ofResponse(dep));
    return [];
  }

  static ofResponse(res: IDeparture): Departure {
    const departure = new Departure();
    departure.name = res.name;
    departure.direction = res.direction;

    departure.departure = Timeservice.buildRTSchedule(
      res.date,
      res.rtDate,
      res.time,
      res.rtTime,
      res.track,
      res.rtTrack
    );

    departure.products = res.Product.map((product) =>
      Product.ofResponse(product)
    );

    departure.journeyRef = res.JourneyDetailRef.ref;
    departure.journeyStatus = res.JourneyStatus;
    departure.stationId = res.stopid;

    return departure;
  }

  getOriginalDepartureTime() {
    return {
      date: this.departure.date.original || this.departure.date.value,
      time: this.departure.time.original || this.departure.time.value,
    };
  }
}

import { Timeservice } from "../../../services/time";

import { RMVApi } from "../api";

import { IDirection } from "./Misc";
import { IStop, Stop } from "./Stop";
import { Departure } from "./Departure";
import { IProduct, Product as RMVProduct } from "./Product";

export interface IJourneyDetails {
  JourneyStatus: string;
  reachable: boolean;
  Stops: {
    Stop: IStop[];
  };
  Product: IProduct[];
  Directions: {
    Direction: IDirection[];
  };
}

export class Journey {
  journeyStatus: string;
  reachable: boolean;
  directions: IDirection[];
  products: RMVProduct[];
  stops: Stop[];
  nextStop: number;

  static ofJourneyDetails(res: IJourneyDetails): Journey {
    const { Stops, Directions, Product } = res;

    const journey = new Journey();
    journey.journeyStatus = res.JourneyStatus;
    journey.reachable = res.reachable;
    journey.directions = Directions.Direction.slice();
    journey.products = Product.map((product) => RMVProduct.ofResponse(product));

    journey.stops = Stops.Stop.map((stop) =>
      Stop.ofResponse(stop, Stops.Stop.length)
    );

    journey.nextStop = journey.getNextStop();

    return journey;
  }

  getStopByID(id: string): Stop | undefined {
    return this.stops.find((stop) => stop.id === id);
  }

  getNextStop() {
    if (!this.stops.length) return -1;

    let idx = this.stops.length - 1;
    const now = Date.now();

    for (let i = 0; i < this.stops.length - 1; i++) {
      const { departure } = this.stops[i];
      const { date, time } = departure;

      const depParsed = Timeservice.parseDateTime(
        date.value,
        time.value
      ).getTime();

      // Next stop
      if (now < depParsed) {
        idx = i;
        break;
      }
    }

    return idx;
  }

  async getContinualDeparture(station_id: string) {
    const station = this.getStopByID(station_id);
    if (!station) return undefined;

    const { date, time } = station.getDateTime();

    const newDate = Timeservice.getNextWorkingDay(
      Timeservice.parseDateTime(date, time)
    ).format("YYYY-MM-DD");

    const board = await RMVApi.getDepartureBoard(station.id, newDate, time);

    const departures = Departure.ofDepartureBoard(board);
    const departure = departures.find((dep) => {
      const depTime = dep.getOriginalDepartureTime();

      return (
        dep.stopId === station_id &&
        dep.direction === station.departureDir &&
        depTime.date === newDate &&
        depTime.time === time
      );
    });

    return departure;
  }
}

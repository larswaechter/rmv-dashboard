import { IDirection, IProduct } from "./Misc";
import { IStop, Stop } from "./Stop";

export interface IJourneyDetails {
  Stops: {
    Stop: IStop[];
  };
  Product: IProduct;
  Directions: {
    Direction: IDirection;
  };
}

export class Journey {
  direction: string;
  product: string;
  stops: Stop[];

  public static ofJourneyDetails(res: IJourneyDetails): Journey {
    const { Stops, Directions, Product } = res;

    const journey = new Journey();
    journey.direction = Directions ? Directions.Direction[0].value : "";
    journey.product = Product ? Product[0].name : "";

    journey.stops = Stops.Stop.map((stop) =>
      Stop.ofResponse(stop, Stops.Stop.length)
    );

    return journey;
  }
}

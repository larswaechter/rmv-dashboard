import { RealtimeValue, RTDate, Timeservice } from "../../../services/time";

export class Stop {
  id: string;
  name: string;
  arrival: RTDate;
  departure: RTDate;
  index: number;
  isFirst: boolean;
  isLast: boolean;

  public static ofResponse(res: any, numberOfStops: number): Stop {
    const stop = new Stop();
    stop.id = res.id;
    stop.name = res.name;

    stop.arrival = Timeservice.buildRTDate(
      res.arrDate,
      res.rtArrDate,
      res.arrTime,
      res.rtArrTime,
      res.depTrack,
      res.rtDepTrack
    );

    stop.departure = Timeservice.buildRTDate(
      res.depDate,
      res.rtDepDate,
      res.depTime,
      res.rtDepTime,
      res.arrTrack,
      res.rtArrTrack
    );

    stop.index = res.routeIdx;

    stop.isFirst = stop.index === 0;
    stop.isLast = stop.index === numberOfStops - 1;

    return stop;
  }
}

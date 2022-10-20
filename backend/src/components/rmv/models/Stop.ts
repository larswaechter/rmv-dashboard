import { RTDate, Timeservice } from "../../../services/time";

export interface IStop {
  id: string;
  name: string;
  routeIdx: number;
  arrDate: string;
  rtArrDate: string;
  arrTime: string;
  rtArrTime: string;
  arrTrack: string;
  rtArrTrack: string;
  depDate: string;
  rtDepDate: string;
  depTime: string;
  rtDepTime: string;
  depTrack: string;
  rtDepTrack: string;
}

export class Stop {
  id: string;
  name: string;
  arrival: RTDate;
  departure: RTDate;
  index: number;
  isFirst: boolean;
  isLast: boolean;

  static ofResponse(res: IStop, numberOfStops: number): Stop {
    const stop = new Stop();
    stop.id = res.id;
    stop.name = res.name;
    stop.index = res.routeIdx;

    stop.arrival = Timeservice.buildRTDate(
      res.arrDate,
      res.rtArrDate,
      res.arrTime,
      res.rtArrTime,
      res.arrTrack,
      res.rtArrTrack
    );

    stop.departure = Timeservice.buildRTDate(
      res.depDate,
      res.rtDepDate,
      res.depTime,
      res.rtDepTime,
      res.depTrack,
      res.rtDepTrack
    );

    stop.isFirst = stop.index === 0;
    stop.isLast = stop.index === numberOfStops - 1;

    return stop;
  }
}

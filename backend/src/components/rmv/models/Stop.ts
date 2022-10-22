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

  buildDeviationMessages() {
    const messages: string[] = [];

    if (this.hasArrivalDelay())
      messages.push(
        `The arrival is delayed by ${this.arrival.delay} minute(s): New arrival @ ${this.arrival.date.value} ${this.arrival.time.value}`
      );
    if (this.hasArrivalTrackChange())
      messages.push(
        `The arrival track has changed: ${this.arrival.track.original}: ${this.arrival.track.value}`
      );

    if (this.hasDepartureDelay())
      messages.push(
        `The departure is delayed by ${this.departure.delay} minute(s) => New departure @ ${this.departure.date.value} ${this.departure.time.value}`
      );
    if (this.hasDepartureTrackChange())
      messages.push(
        `The departure track has changed: ${this.departure.track.value} => ${this.departure.track.value}`
      );

    return messages;
  }

  hasScheduleChange() {
    return this.hasDelay() || this.hasTrackChange();
  }

  hasDelay() {
    return this.hasArrivalDelay() || this.hasDepartureDelay();
  }

  hasArrivalDelay() {
    return this.arrival.delay > 0;
  }

  hasDepartureDelay() {
    return this.departure.delay > 0;
  }

  hasTrackChange() {
    this.hasArrivalTrackChange() || this.hasDepartureTrackChange();
  }

  hasArrivalTrackChange() {
    return this.arrival.track.original !== undefined;
  }

  hasDepartureTrackChange() {
    return this.departure.track.original !== undefined;
  }
}

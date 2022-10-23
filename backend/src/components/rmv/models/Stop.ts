import hash from "object-hash";

import { RTSchedule, Timeservice } from "../../../services/time";

type DateTime = {
  date: string;
  time: string;
};

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
  depDir: string;
}

export class Stop {
  id: string;
  name: string;
  arrival?: RTSchedule;
  departure?: RTSchedule;
  departureDir?: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;

  static ofResponse(res: IStop, numberOfStops: number): Stop {
    const stop = new Stop();
    stop.id = res.id;
    stop.name = res.name;
    stop.index = res.routeIdx;

    stop.departureDir = res.depDir;
    stop.isFirst = stop.index === 0;
    stop.isLast = stop.index === numberOfStops - 1;

    if (!stop.isFirst)
      stop.arrival = Timeservice.buildRTDate(
        res.arrDate,
        res.rtArrDate,
        res.arrTime,
        res.rtArrTime,
        res.arrTrack,
        res.rtArrTrack
      );

    if (!stop.isLast)
      stop.departure = Timeservice.buildRTDate(
        res.depDate,
        res.rtDepDate,
        res.depTime,
        res.rtDepTime,
        res.depTrack,
        res.rtDepTrack
      );

    return stop;
  }

  getOriginalDateTime(type: "arrival" | "departure"): DateTime {
    switch (type) {
      case "arrival":
        return {
          date: this.arrival.date.original || this.arrival.date.value,
          time: this.arrival.time.original || this.arrival.time.value,
        };
      default:
        return {
          date: this.departure.date.original || this.departure.date.value,
          time: this.departure.time.original || this.departure.time.value,
        };
    }
  }

  getScheduleHash() {
    return hash({
      arrival: this.arrival,
      departure: this.departure,
    });
  }

  getDateTime(): DateTime {
    return this.isLast
      ? this.getOriginalDateTime("arrival")
      : this.getOriginalDateTime("departure");
  }

  wasReached() {
    const { date, time } = this.getDateTime();
    return Timeservice.parseDateTime(date, time) < new Date();
  }

  buildDeviationMessages() {
    const messages: string[] = [];

    if (this.hasArrivalDelay())
      messages.push(
        `The arrival is delayed by ${this.arrival.delay} minute(s): Now @${this.arrival.date.value} ${this.arrival.time.value}`
      );
    if (this.hasArrivalTrackChange())
      messages.push(
        `The arrival track has changed: ~~${this.arrival.track.original}~~ => ${this.arrival.track.value}`
      );

    if (this.hasDepartureDelay())
      messages.push(
        `The departure is delayed by ${this.departure.delay} minute(s) => Now @${this.departure.date.value} ${this.departure.time.value}`
      );
    if (this.hasDepartureTrackChange())
      messages.push(
        `The departure track has changed: ~~${this.departure.track.value}~~ => ${this.departure.track.value}`
      );

    return messages;
  }

  buildDeviationMessagesShort() {
    const messages: string[] = [];

    if (this.hasArrivalDelay())
      messages.push(
        `Arrival: ${this.arrival.date.value} ${this.arrival.time.value} (+${this.arrival.delay}m)`
      );
    if (this.hasArrivalTrackChange())
      messages.push(`Arrival track ${this.arrival.track.value}`);

    if (this.hasDepartureDelay())
      messages.push(
        `Departure: ${this.departure.date.value} ${this.departure.time.value} (+${this.departure.delay}m)`
      );
    if (this.hasDepartureTrackChange())
      messages.push(`Departure track: ${this.departure.track.value}`);

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

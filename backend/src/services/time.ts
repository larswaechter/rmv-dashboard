export interface RealtimeValue {
  value: string;
  original?: string;
}

export interface RTDate {
  date: RealtimeValue;
  time: RealtimeValue;
  delay: number;
  track: RealtimeValue;
}

export class Timeservice {
  static hasRealtimeValue = (value, rt) => rt !== undefined && rt !== value;

  static getRealtimeValue = (
    value: string,
    rt: string,
    defaultVal?: string
  ): RealtimeValue =>
    Timeservice.hasRealtimeValue(value, rt)
      ? { value: rt, original: value }
      : { value: value !== undefined ? value : defaultVal };

  static parseDateTime = (date: string, time: string) => {
    const [arrYear, arrMonth, arrDay] = date.split("-");
    const [arrHours, arrMin, arrSec] = time.split(":");

    return new Date(
      +arrYear,
      +arrMonth - 1,
      +arrDay,
      +arrHours,
      +arrMin,
      +arrSec
    );
  };

  static getDelayInMinutes = (date: RealtimeValue, time: RealtimeValue) => {
    if (!date.original && !time.original) return 0;

    const dateOriginal = date.original ? date.original : date.value;
    const timeOriginal = time.original ? time.original : time.value;

    const datePlan = date.value;
    const timePlan = time.value;

    return Timeservice.getDateDiffInSec(
      Timeservice.parseDateTime(dateOriginal, timeOriginal),
      Timeservice.parseDateTime(datePlan, timePlan)
    );
  };

  static buildRTDate(
    date: string,
    rtDate: string,
    time: string,
    rtTime: string,
    track: string,
    rtTrack: string
  ): RTDate {
    const _date = Timeservice.getRealtimeValue(date, rtDate);
    const _time = Timeservice.getRealtimeValue(time, rtTime);
    const _track = Timeservice.getRealtimeValue(track, rtTrack);

    const delay = Timeservice.getDelayInMinutes(_date, _time);

    return {
      date: _date,
      time: _time,
      track: _track,
      delay,
    };
  }

  private static getDateDiffInSec = (start, end) => (end - start) / 1000 / 60;
}

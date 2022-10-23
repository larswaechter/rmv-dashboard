import dayjs from "dayjs";

export interface RTValue {
  value: string;
  original?: string;
}

export interface RTSchedule {
  date: RTValue;
  time: RTValue;
  parsed: Date;
  delay: number;
  track: RTValue;
}

export class Timeservice {
  static hasRealtimeValue = (value, rt) => rt !== undefined && rt !== value;

  static getRealtimeValue = (
    value: string,
    rt: string,
    defaultVal?: string
  ): RTValue =>
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

  static getDelayInMinutes = (date: RTValue, time: RTValue) => {
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

  static getNextWorkingDay(date: Date) {
    const datejs = dayjs(date);

    switch (datejs.day()) {
      case 5:
        return datejs.add(3, "day");
      case 6:
        return datejs.add(2, "day");
      default:
        return datejs.add(1, "day");
    }
  }

  static buildRTDate(
    date: string,
    rtDate: string,
    time: string,
    rtTime: string,
    track: string,
    rtTrack: string
  ): RTSchedule {
    const _date = Timeservice.getRealtimeValue(date, rtDate);
    const _time = Timeservice.getRealtimeValue(time, rtTime);
    const _track = Timeservice.getRealtimeValue(track, rtTrack);

    const delay = Timeservice.getDelayInMinutes(_date, _time);

    return {
      date: _date,
      time: _time,
      parsed: Timeservice.parseDateTime(_date.value, _time.value),
      track: _track,
      delay,
    };
  }

  private static getDateDiffInSec = (start, end) => (end - start) / 1000 / 60;
}

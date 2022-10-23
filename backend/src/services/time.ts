import dayjs from "dayjs";

export interface RTValue {
  value: any;
  original?: any;
}

export interface RTSchedule {
  date: RTValue;
  time: RTValue;
  parsed: Date;
  delay: number;
  track: RTValue;
}

export class Timeservice {
  static hasRealtimeValue = (value: any, rt?: any) =>
    rt !== undefined && rt !== value;

  static getRealtimeValue = (value: any, rt: any, defaultVal?: any): RTValue =>
    Timeservice.hasRealtimeValue(value, rt)
      ? { value: rt, original: value }
      : { value: value !== undefined ? value : defaultVal };

  static buildRTSchedule(
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

    return Timeservice.getDateDiffInMin(
      Timeservice.parseDateTime(dateOriginal, timeOriginal),
      Timeservice.parseDateTime(datePlan, timePlan)
    );
  };

  static addDays(date: Date, n: number): dayjs.Dayjs {
    const datejs = dayjs(date);

    // Exception on weekend
    if (n % 7 === 0 && [0, 6].includes(datejs.day())) return datejs.add(n);

    const daysToAdd = Math.min(n, 7);
    const remainder = n - daysToAdd;

    let newDate = datejs.add(daysToAdd, "day");

    // Number of passed working days
    const passed = Math.max(5 - datejs.day(), 0);
    switch (newDate.day()) {
      case 0:
        newDate = newDate.add(daysToAdd - passed, "day");
        break;
      case 6:
        newDate = newDate.add(1 + daysToAdd - passed, "day");
        break;
    }

    return remainder > 0
      ? Timeservice.addDays(newDate.toDate(), remainder)
      : newDate;
  }

  private static getDateDiffInMin = (start: Date, end: Date) =>
    Math.floor((end.valueOf() - start.valueOf()) / 1000 / 60);
}

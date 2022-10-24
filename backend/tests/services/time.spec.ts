import { RTValue, Timeservice } from "../../src/services/time";

describe("Timeservice", () => {
  it("hasRealtimeValue", () => {
    expect(Timeservice.hasRealtimeValue(1, 2)).toBe(true);
  });

  it("hasRealtimeValue", () => {
    expect(Timeservice.hasRealtimeValue(1, 1)).toBe(false);
  });

  it("hasRealtimeValue", () => {
    expect(Timeservice.hasRealtimeValue(1, undefined)).toBe(false);
  });

  it("getRealtimeValue", () => {
    const { value, original } = Timeservice.getRealtimeValue(1, 2);
    expect(value).toBe(2);
    expect(original).toBe(1);
  });

  it("getRealtimeValue", () => {
    const { value, original } = Timeservice.getRealtimeValue(1, 1);
    expect(value).toBe(1);
    expect(original).toBe(undefined);
  });

  it("buildRTDate", () => {
    const data = Timeservice.buildRTSchedule(
      "2022-07-25",
      "2022-07-25",
      "10:45:00",
      "10:45:00",
      "7",
      "7"
    );

    expect(data.date.value).toBe("2022-07-25");
    expect(data.date.original).toBe(undefined);
    expect(data.time.value).toBe("10:45:00");
    expect(data.time.original).toBe(undefined);

    expect(data.delay).toBe(0);

    expect(data.track.value).toBe("7");
    expect(data.track.original).toBe(undefined);
  });

  it("buildRTDate", () => {
    const data = Timeservice.buildRTSchedule(
      "2022-07-25",
      "2022-07-25",
      "10:45:00",
      "10:58:00",
      "7",
      "9"
    );

    expect(data.date.value).toBe("2022-07-25");
    expect(data.date.original).toBe(undefined);
    expect(data.time.value).toBe("10:58:00");
    expect(data.time.original).toBe("10:45:00");

    expect(data.delay).toBe(13);

    expect(data.track.value).toBe("9");
    expect(data.track.original).toBe("7");
  });

  it("buildRTDate", () => {
    const data = Timeservice.buildRTSchedule(
      "2022-07-25",
      "2022-07-26",
      "23:55:00",
      "00:04:00",
      "7",
      "9"
    );

    expect(data.date.value).toBe("2022-07-26");
    expect(data.date.original).toBe("2022-07-25");
    expect(data.time.value).toBe("00:04:00");
    expect(data.time.original).toBe("23:55:00");

    expect(data.delay).toBe(9);

    expect(data.track.value).toBe("9");
    expect(data.track.original).toBe("7");
  });

  it("parseDateTime", () => {
    const date = Timeservice.parseDateTime("2022-07-28", "10:45:12");
    expect(date.getFullYear()).toBe(2022);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(28);
    expect(date.getHours()).toBe(10);
    expect(date.getMinutes()).toBe(45);
    expect(date.getSeconds()).toBe(12);
  });

  it("getDelayInMinutes", () => {
    const date: RTValue = {
      value: "2022-07-28",
    };
    const time: RTValue = {
      value: "10:45:05",
      original: "10:40:10",
    };

    expect(Timeservice.getDelayInMinutes(date, time)).toBe(4);
  });

  it("getDelayInMinutes", () => {
    const date: RTValue = {
      value: "2022-07-28",
    };
    const time: RTValue = {
      value: "11:14:10",
      original: "10:45:05",
    };

    expect(Timeservice.getDelayInMinutes(date, time)).toBe(29);
  });

  it("addDays +3", () => {
    const date = new Date(2022, 9, 17);
    const newDate = Timeservice.addDays(date, 3);
    expect(newDate.format("DD")).toBe("20"); // MO => THU
  });

  it("addDays +7", () => {
    const date = new Date(2022, 9, 17);
    const newDate = Timeservice.addDays(date, 7);
    expect(newDate.format("DD")).toBe("24"); // Mo => MO
  });

  it("addDays +8", () => {
    const date = new Date(2022, 9, 17);
    const newDate = Timeservice.addDays(date, 8);
    expect(newDate.format("DD")).toBe("25"); // Mo => TU
  });

  it("addDays +5", () => {
    const date = new Date(2022, 9, 18);
    const newDate = Timeservice.addDays(date, 5);
    expect(newDate.format("DD")).toBe("25"); // TU => TU
  });

  it("addDays +3", () => {
    const date = new Date(2022, 9, 20);
    const newDate = Timeservice.addDays(date, 3);
    expect(newDate.format("DD")).toBe("25"); // THU => TU
  });

  it("addDays +10", () => {
    const date = new Date(2022, 9, 13);
    const newDate = Timeservice.addDays(date, 10);
    expect(newDate.format("DD")).toBe("25"); // THU => TU
  });
});

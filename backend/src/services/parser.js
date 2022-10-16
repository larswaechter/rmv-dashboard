const { getRealtimeValue } = require("./helper");

const parseJourney = (journey) => {
  const { Stops } = journey;
  return {
    stops: Stops.Stop.map(
      ({
        name,
        arrDate,
        rtArrDate,
        depDate,
        rtDepDate,
        arrTime,
        rtArrTime,
        depTime,
        rtDepTime,
        depTrack,
        rtDepTrack,
      }) => ({
        name,
        arrDate: getRealtimeValue(arrDate, rtArrDate),
        arrTime: getRealtimeValue(arrTime, rtArrTime),
        depDate: getRealtimeValue(depDate, rtDepDate),
        depTime: getRealtimeValue(depTime, rtDepTime),
        depTrack: getRealtimeValue(depTrack, rtDepTrack),
      })
    ),
  };
};

const parseDeparture = (departure) => {
  const {
    name,
    date,
    rtDate,
    time,
    rtTime,
    track,
    rtTrack,
    direction,
    JourneyDetailRef,
    Product,
    Notes,
  } = departure;

  return {
    name,
    direction,
    date: getRealtimeValue(date, rtDate),
    time: getRealtimeValue(time, rtTime),
    track: getRealtimeValue(track, rtTrack, "-"),
    journeyRef: JourneyDetailRef.ref,
    category: Product ? Product[0].catOut : "",
    notes: Array.from(new Set(Notes.Note.map(({ value }) => value))),
  };
};

module.exports = {
  parseJourney,
  parseDeparture,
};

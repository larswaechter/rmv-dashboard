const { getRealtimeValue } = require("./helper");

const parseJourney = (journey) => {
  const { Stops, Directions, Product } = journey;
  return {
    direction: Directions ? Directions.Direction[0].value : "",
    product: Product ? Product[0].name : "",
    stops: Stops.Stop.map(
      (
        {
          id,
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
          routeIdx,
        },
        i
      ) => ({
        id,
        name,
        arrDate: getRealtimeValue(arrDate, rtArrDate),
        arrTime: getRealtimeValue(arrTime, rtArrTime),
        depDate: getRealtimeValue(depDate, rtDepDate),
        depTime: getRealtimeValue(depTime, rtDepTime),
        depTrack: getRealtimeValue(depTrack, rtDepTrack),
        routeIdx,
        isFirst: i === 0,
        isLast: i === Stops.Stop.length - 1,
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

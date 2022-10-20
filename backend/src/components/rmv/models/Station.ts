export interface IStopLocation {
  id: string;
  name: string;
  lat: string;
  lon: string;
  weight: number;
}

export interface IStation {
  stopLocationOrCoordLocation: {
    StopLocation: IStopLocation;
  }[];
}

export class Station {
  station_id: string;
  name: string;

  static ofResponse(res: IStopLocation): Station {
    const location = new Station();
    location.station_id = res.id;
    location.name = res.name;

    return location;
  }
}

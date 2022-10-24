export interface IDirection {
  value: string;
  flag: string;
  routeIdxFrom: number;
  routeIdxTo: number;
}

export interface IJourneyDetailRef {
  ref: string;
}

export interface IMessage {
  head: string;
  lead: string;
}

export interface INote {
  key: string;
  value: string;
  priority: number;
}

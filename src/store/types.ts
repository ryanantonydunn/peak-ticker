export type PinType = "hill" | "crag";

export interface PinListOption {
  name: string;
  slug: string;
  pinType: PinType;
}

export interface RouteHill {
  id: string;
  pinId: string;
  name: string;
  height: string;
  url: string;
}

export interface RouteCrag {
  id: string;
  pinId: string;
  name: string;
  stars: string;
  grade: string;
}

export type Route = RouteHill | RouteCrag;

export interface CsvPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export type Pin = CsvPin & {
  routeHills: RouteHill[];
  routeCrags: RouteCrag[];
};

export interface RouteTick {
  pinType: string;
  id: string;
  date: string;
}

export interface Store {
  search: string;
  options: PinListOption[];
  optionIndex: number;
  ticks: RouteTick[];
  pins: Pin[];
  setSearch: (search: string) => void;
  setOptions: (options: PinListOption[]) => void;
  setOptionIndex: (i: number) => void;
  toggleTick: (id: string, pinType: string) => void;
  setPins: (pins: Pin[]) => void;
  setTicks: (ticks: RouteTick[]) => void;
}

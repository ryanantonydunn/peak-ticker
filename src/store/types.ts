// export enum Action {
//   "SET_SEARCH",
//   "SET_TYPE",
//   "TOGGLE_PEAK_TICK",
//   "SET_PEAKS",
// }

export type PeakType = "wainwright" | "munro";

export interface Peak {
  id: number;
  name: string;
  type: string;
  height: string;
  latitude: number;
  longitude: number;
  url: string;
}

export interface PeakTick {
  id: number;
  date: string;
}

// export interface State {
//   search: string;
//   type: PeakType;
//   ticks: PeakTick[];
//   peaks: Peak[];
// }

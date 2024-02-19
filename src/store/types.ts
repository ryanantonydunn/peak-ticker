export type PeakType = "wainwright" | "munro";

export interface Peak {
  id: string;
  name: string;
  type: string;
  height: string;
  latitude: number;
  longitude: number;
  url: string;
}

export interface PeakTick {
  id: string;
  date: string;
}

export interface Store {
  search: string;
  type: PeakType;
  ticks: PeakTick[];
  peaks: Peak[];
  setSearch: (search: string) => void;
  setType: (type: PeakType) => void;
  togglePeakTick: (peakId: string) => void;
  setPeaks: (peaks: Peak[]) => void;
  setTicks: (ticks: PeakTick[]) => void;
}

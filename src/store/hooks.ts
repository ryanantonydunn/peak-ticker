import React from "react";
import Papa from "papaparse";
import { Peak, PeakTick } from "./types";
import { useStore } from "./store";

// Load peaks from CSV file
export const usePeaks = () => {
  const { type, peaks, setPeaks } = useStore((state) => ({
    type: state.type,
    peaks: state.peaks,
    setPeaks: state.setPeaks,
  }));

  // Load peaks on mount or when the type changes
  React.useEffect(() => {
    async function load() {
      const response = await fetch(`/data/${type}.csv`);
      const str = await response.text();
      const json = Papa.parse<Peak>(str, { header: true, dynamicTyping: true });
      const newPeaks = json.data
        .filter(
          (row) =>
            row.name &&
            row.latitude !== undefined &&
            row.longitude !== undefined
        )
        .map((row) => ({ ...row, id: String(row.id) }));
      setPeaks(newPeaks);
    }
    load();
  }, [setPeaks, type]);

  return peaks;
};

// Get peaks and filter them by the search
export const useFilteredPeaks = () => {
  const peaks = usePeaks();
  const { search } = useStore((state) => ({
    search: state.search,
  }));
  return React.useMemo(() => {
    if (!search) return peaks;

    return peaks.filter((peak) =>
      peak.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, peaks]);
};

// Get ticked peaks organised by ID
type TickedPeaksRef = { [key: string]: PeakTick };
export const useTickedPeaks = () => {
  const ticks = useStore((state) => state.ticks);
  return React.useMemo(() => {
    const tickedPeaksRef: TickedPeaksRef = {};
    ticks.forEach((peakTick) => {
      tickedPeaksRef[peakTick.id] = peakTick;
    });
    return tickedPeaksRef;
  }, [ticks]);
};

// Count how many of the current loaded and filtered peaks we have ticked
export const useTickedPeaksCount = () => {
  const peaks = useFilteredPeaks();
  const tickedPeaks = useTickedPeaks();
  let ticked = 0;
  peaks.forEach((peak) => {
    if (tickedPeaks[peak.id]) {
      ticked++;
    }
  });
  return { total: peaks.length, ticked };
};

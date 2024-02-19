import { create } from "zustand";
import { Store } from "./types";
import { persist } from "zustand/middleware";

export const useStore = create<Store>()(
  persist(
    (set) => ({
      search: "",
      type: "wainwright",
      ticks: [],
      peaks: [],
      setSearch: (search) => set(() => ({ search })),
      setType: (type) => set(() => ({ type })),
      togglePeakTick: (peakId) =>
        set((state) => {
          // remove if already exists
          for (let i = 0; i < state.ticks.length; i++) {
            if (state.ticks[i].id === peakId) {
              const newTicks = [...state.ticks];
              newTicks.splice(i, 1);
              return { ticks: newTicks };
            }
          }
          // add if does not exist
          return {
            ticks: [
              ...state.ticks,
              { id: peakId, date: new Date().toISOString() },
            ],
          };
        }),
      setTicks: (ticks) => set(() => ({ ticks })),
      setPeaks: (peaks) => set(() => ({ peaks })),
    }),
    {
      name: "peak-ticker",
      version: 1,
      partialize: (state) => ({ ticks: state.ticks }),
    }
  )
);

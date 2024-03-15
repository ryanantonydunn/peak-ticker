import { create } from "zustand";
import { Store } from "./types";
import { persist } from "zustand/middleware";

export const useStore = create<Store>()(
  persist(
    (set) => ({
      search: "",
      options: [],
      optionIndex: -1,
      ticks: [],
      pins: [],
      routes: [],
      setSearch: (search) => set(() => ({ search })),
      setOptions: (options) => set(() => ({ options })),
      setOptionIndex: (optionIndex) => set(() => ({ optionIndex })),
      toggleTick: (id: string, pinType: string) =>
        set((state) => {
          // remove if already exists
          for (let i = 0; i < state.ticks.length; i++) {
            const tick = state.ticks[i];
            if (tick.id === id && tick.pinType === pinType) {
              const newTicks = [...state.ticks];
              newTicks.splice(i, 1);
              return { ticks: newTicks };
            }
          }
          // add if does not exist
          return {
            ticks: [
              ...state.ticks,
              { id, date: new Date().toISOString(), pinType },
            ],
          };
        }),
      setTicks: (ticks) => set(() => ({ ticks })),
      setPins: (pins) => set(() => ({ pins })),
    }),
    {
      name: "peak-ticker",
      partialize: (state) => ({ ticks: state.ticks }),
      version: 2,
      migrate: (oldStateUntyped, oldVersion) => {
        // Unsure how to resolve this TS error more cleanly, suspect issue with migrate and partialise
        const oldState = oldStateUntyped as Store;
        if (oldVersion === 1) {
          const ticks = oldState.ticks.map((tick) => ({
            ...tick,
            pinType: "hill",
          }));
          return { ...oldState, ticks };
        }
        return oldState;
      },
    }
  )
);

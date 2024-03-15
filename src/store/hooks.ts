import Papa from "papaparse";
import React from "react";
import { useStore } from "./store";
import { Pin, PinListOption, Route, RouteCrag, RouteHill } from "./types";

const papaOptions = { header: true, dynamicTyping: true };

/**
 * Load pin type options (eg: hills, wainwrights, classic rock routes)
 */
export const useOptions = () => {
  const { options, setOptions, setOptionIndex } = useStore((state) => ({
    options: state.options,
    setOptions: state.setOptions,
    setOptionIndex: state.setOptionIndex,
  }));

  // Load reference files
  React.useEffect(() => {
    async function load() {
      const hillsRes = await fetch(`/data/pin-list-hills.csv`);
      const hillsStr = await hillsRes.text();
      const hillsJson = Papa.parse<PinListOption>(hillsStr, papaOptions);

      const cragsRes = await fetch(`/data/pin-list-crags.csv`);
      const cragsStr = await cragsRes.text();
      const cragsJson = Papa.parse<PinListOption>(cragsStr, papaOptions);

      setOptions(
        [...hillsJson.data, ...cragsJson.data].filter((row) => !!row.slug)
      );
      setOptionIndex(0);
    }
    load();
  }, [setOptions, setOptionIndex]);

  return options;
};

/**
 * Use currently selected option
 */
export const useOption = () => {
  return useStore((state) => state.options[state.optionIndex]) || null;
};

/**
 * Load all pins and routes for the currently selected option
 */
export const usePins = () => {
  const option = useOption();
  const { pins, setPins } = useStore((state) => ({
    pins: state.pins,
    setPins: state.setPins,
  }));

  // Load items on mount or when the type changes
  React.useEffect(() => {
    async function load() {
      if (!option) return;

      // load pins
      const pinsRes = await fetch(`/data/pins-${option.slug}.csv`);
      const pinsStr = await pinsRes.text();
      const pinsJson = Papa.parse<Pin>(pinsStr, papaOptions);
      const pinRows = pinsJson.data
        .filter((r) => r.latitude !== undefined && r.longitude !== undefined)
        .map((r) => ({ ...r, id: String(r.id) }));

      // load routes
      const routesRes = await fetch(`/data/routes-${option.slug}.csv`);
      const routesStr = await routesRes.text();
      const routesJson = Papa.parse<Route>(routesStr, papaOptions);

      // combine routes into pins
      const newPins = pinRows.map((pin) => {
        const routeRows = routesJson.data
          .map((r) => ({ ...r, id: String(r.id), pinId: String(r.pinId) }))
          .filter((r) => r.pinId === pin.id);
        return {
          ...pin,
          routeCrags:
            option.pinType === "crag" ? (routeRows as RouteCrag[]) : [],
          routeHills:
            option.pinType === "hill" ? (routeRows as RouteHill[]) : [],
        };
      });
      setPins(newPins);
    }
    load();
  }, [option, setPins]);

  return pins;
};

/**
 * Get current pins and routes and filter them by search
 * Will show any pins with a name that matches or any pins with a containing route that matches
 */
export const useFilteredPins = () => {
  const pins = usePins();
  const search = useStore((state) => state.search);

  return React.useMemo(() => {
    if (!search) return pins;

    const isMatch = (str: string) =>
      str && str.toLowerCase().includes(search.toLowerCase());

    return pins.filter((pin) => {
      if (isMatch(pin.name)) {
        return true;
      }
      const routes = [...pin.routeCrags, ...pin.routeHills];
      if (routes.some((route) => isMatch(route.name))) {
        return true;
      }
    });
  }, [search, pins]);
};

/**
 * Check if a route is ticked
 */
export const useIsRouteTicked = () => {
  const ticks = useStore((state) => state.ticks);
  const option = useOption();

  return React.useCallback(
    (route: Route) =>
      !!ticks.find(
        (tick) => tick.id === route.id && tick.pinType === option.pinType
      ),
    [ticks, option]
  );
};

/**
 * Count how many of the current loaded and filtered Items we have ticked
 */
export const useTickCount = () => {
  const pins = useFilteredPins();
  const isRouteTicked = useIsRouteTicked();

  let total = 0;
  let ticked = 0;
  pins.forEach((pin) => {
    const routes = [...pin.routeCrags, ...pin.routeHills];
    total += routes.length;
    routes.forEach((route) => {
      if (isRouteTicked(route)) {
        ticked++;
      }
    });
  });
  return { total, ticked };
};

/**
 * Get a pin color
 */
export const useGetPinColor = () => {
  const isRouteTicked = useIsRouteTicked();

  return React.useCallback(
    (pin: Pin) => {
      const routes = [...pin.routeCrags, ...pin.routeHills];
      if (routes.every(isRouteTicked)) {
        return "blue";
      } else if (routes.some(isRouteTicked)) {
        return "orange";
      }
      return "red";
    },
    [isRouteTicked]
  );
};

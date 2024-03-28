import { CombinedPin, Route } from "./types";

export function getRoutesFromCombinedPin(pin: CombinedPin): Route[] {
  return pin.pins.map((p) => [p.routeCrags, p.routeHills]).flat(9);
}

export function getAverage(arr: number[]): number {
  return arr.reduce((acc, value) => acc + value, 0) / Math.max(1, arr.length);
}

export function setMidPoint(pin: CombinedPin): void {
  pin.latitude = getAverage(pin.pins.map((p) => p.latitude));
  pin.longitude = getAverage(pin.pins.map((p) => p.longitude));
}

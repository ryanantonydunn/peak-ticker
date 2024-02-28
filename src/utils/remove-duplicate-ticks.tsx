import { PeakTick } from "@/store/types";

/**
 * Remove any ticks in the list that are duplicates
 */
export function removeDuplicateTicks(ticks: PeakTick[]): PeakTick[] {
  // build object of all index instances of all peak ID's
  const idIndexes: { [key: string]: number[] } = {}; // { id: [indexes of instances] }
  ticks.forEach((tick, i) => {
    if (!idIndexes[tick.id]) idIndexes[tick.id] = [];
    idIndexes[tick.id].push(i);
  });

  // build new array of all indexes to be removed
  // take all duplicate ID indexes that are not the last in the list of instances
  const indexesToBeRemoved: number[] = [];
  Object.values(idIndexes).forEach((indexes) => {
    indexesToBeRemoved.push(...indexes.slice(0, -1));
  });

  // sort indexes to be removed by highest first to avoid conflicts
  // eg: if we splice index 2 and now what was at index 5 is now at index 4
  const sortedIndexes = indexesToBeRemoved.sort((a, b) => b - a);

  // make alert of all duplicated being remove
  if (sortedIndexes.length > 0) {
    alert(
      `Removing duplicate entries:\n${sortedIndexes
        .map((i) => `Peak ID ${ticks[i].id} at index ${i}`)
        .join("\n")}`
    );
  }

  // duplicate ticklist and remove indexes
  const newTicks = [...ticks];
  sortedIndexes.forEach((i) => {
    newTicks.splice(i, 1);
  });

  return newTicks;
}

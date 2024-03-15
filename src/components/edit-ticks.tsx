"use client";

import { useStore } from "@/store/store";
import { RouteTick } from "@/store/types";
import React from "react";

export function EditTicks() {
  const [open, setOpen] = React.useState(false);
  const { ticks, setTicks } = useStore((state) => ({
    ticks: state.ticks,
    setTicks: state.setTicks,
  }));

  // create editable string from tick objects
  const [textareaString, setTextareaString] = React.useState("");
  const baseTextareaString = React.useMemo(() => {
    const newString = ticks
      .map((tick) => `${tick.id},${tick.date},${tick.pinType}`)
      .join("\n");
    setTextareaString(newString);
    return newString;
  }, [ticks]);

  // attempt to save updated value and show errors
  const [error, setError] = React.useState("");
  const save = React.useCallback(() => {
    try {
      // convert ticks to route objects
      const newTicks: RouteTick[] = [];
      textareaString.split("\n").forEach((str) => {
        const [id, date, pinType] = str.split(",");
        if (id !== undefined && ["hill", "crag"].includes(pinType)) {
          const newDate = date ? new Date(date) : new Date();
          newTicks.push({ id, date: newDate.toISOString(), pinType });
        }
      });

      setTicks(removeDuplicateTicks(newTicks));
      setOpen(false);
      setError("");
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
  }, [setTicks, textareaString]);

  return (
    <div
      className={`absolute top-0 right-0 p-2 pb-0 bg-gray-800 text-xs ${
        open ? "w-full sm:w-96" : ""
      }`}
      style={{ zIndex: 999 }}
    >
      {open ? (
        <div>
          <div className="flex">
            <button
              onClick={() => {
                setError("");
                setTextareaString(baseTextareaString);
                setOpen(false);
              }}
              className="p-1 bg-gray-700 w-full mb-2 block"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                save();
              }}
              className="p-1 bg-gray-700 w-full mb-2 ml-2 block"
            >
              Done
            </button>
          </div>
          <textarea
            className="p-1 bg-gray-700 w-full mb-2 block h-40"
            value={textareaString}
            onChange={(e) => setTextareaString(e.target.value)}
          />
          {error && (
            <div className="p-1 bg-red-800 text-white mb-2">
              Error:
              <br />
              {error}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="p-1 bg-gray-700 w-full mb-2 block"
        >
          Open Tick Editor
        </button>
      )}
    </div>
  );
}

/**
 * Remove any ticks in the list that are duplicates
 */
export function removeDuplicateTicks(ticks: RouteTick[]): RouteTick[] {
  // build object of all index instances of all peak ID's
  const idIndexes: { [key: string]: number[] } = {}; // { [pinType-id]: [indexes of instances] }
  ticks.forEach((tick, i) => {
    const key = `${tick.pinType}-${tick.id}`;
    if (!idIndexes[key]) idIndexes[key] = [];
    idIndexes[key].push(i);
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
        .map(
          (i) =>
            `Peak ID ${ticks[i].id} and pin type ${ticks[i].pinType} at index ${i}`
        )
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

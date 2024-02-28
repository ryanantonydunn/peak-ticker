"use client";

import { useStore } from "@/store/store";
import { removeDuplicateTicks } from "@/utils/remove-duplicate-ticks";
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
    const newString = ticks.map((peak) => `${peak.id},${peak.date}`).join("\n");
    setTextareaString(newString);
    return newString;
  }, [ticks]);

  // attempt to save updated value and show errors
  const [error, setError] = React.useState("");
  const save = React.useCallback(() => {
    try {
      // convert ticks to peak objects
      const newTicks = textareaString.split("\n").map((str) => {
        const [id, date] = str.split(",");
        const newDate = date ? new Date(date) : new Date();
        return { id, date: newDate.toISOString() };
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

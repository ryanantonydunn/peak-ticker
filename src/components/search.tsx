"use client";

import { useOptions, useTickCount } from "@/store/hooks";
import { useStore } from "@/store/store";
import { PinListOption } from "@/store/types";
import React from "react";

const titles: { [key: string]: string } = {
  hill: "Hills",
  crag: "Climbs",
};

export function Search() {
  const options = useOptions();
  const { search, setSearch, optionIndex, setOptionIndex } = useStore(
    (state) => ({
      search: state.search,
      setSearch: state.setSearch,
      optionIndex: state.optionIndex,
      setOptionIndex: state.setOptionIndex,
    })
  );
  const tickCount = useTickCount();

  const groups = React.useMemo(() => {
    const obj: { [key: string]: [PinListOption, number][] } = {};
    options.forEach((opt, i) => {
      if (!obj[opt.pinType]) obj[opt.pinType] = [];
      obj[opt.pinType].push([opt, i]);
    });
    return obj;
  }, [options]);

  return (
    <div
      className="absolute bottom-0 left-0 p-2 bg-gray-800 flex items-center text-xs"
      style={{ zIndex: 999 }}
    >
      <div>
        Type:&nbsp;
        <select
          name="type"
          value={optionIndex}
          onChange={(e) => setOptionIndex(Number(e.target.value))}
          className="bg-gray-700 text-white p-1 text-xs w-32"
        >
          {Object.entries(groups).map(([pinType, options]) => (
            <optgroup key={pinType} label={titles[pinType] || ""}>
              {options.map(([option, originalIndex]) => (
                <option value={originalIndex} key={originalIndex}>
                  {option.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="ml-2">
        Filter:&nbsp;
        <input
          name="search"
          className="bg-gray-700 text-white p-1 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <span className="pl-2">
        Ticked:{" "}
        <b>
          {tickCount.ticked} / {tickCount.total}
        </b>
      </span>
    </div>
  );
}

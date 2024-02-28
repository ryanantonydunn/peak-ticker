"use client";

import { useTickedPeaksCount } from "@/store/hooks";
import { useStore } from "@/store/store";
import { PeakType } from "@/store/types";
import React from "react";

export function Search() {
  const { search, setSearch, type, setType } = useStore((state) => ({
    search: state.search,
    setSearch: state.setSearch,
    type: state.type,
    setType: state.setType,
  }));
  const tickCount = useTickedPeaksCount();
  return (
    <div
      className="absolute bottom-0 left-0 p-2 bg-gray-800 flex items-center text-xs"
      style={{ zIndex: 999 }}
    >
      <div>
        Type:&nbsp;
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as PeakType)}
          className="bg-gray-700 text-white p-1 text-xs"
        >
          <option value="wainwright">Wainwrights</option>
          <option value="munro">Munros</option>
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

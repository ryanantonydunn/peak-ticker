import { useTickedPeaksCount } from "@/store/hooks";
import { useStore } from "@/store/store";
import { PeakType } from "@/store/types";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import React from "react";

export default function Search() {
  const { search, setSearch, type, setType } = useStore((state) => ({
    search: state.search,
    setSearch: state.setSearch,
    type: state.type,
    setType: state.setType,
  }));
  const tickCount = useTickedPeaksCount();
  return (
    <div
      className="absolute bottom-0 left-0 p-2 bg-gray-800 flex items-center"
      style={{ zIndex: 999 }}
    >
      <select
        name="type"
        value={type}
        onChange={(e) => setType(e.target.value as PeakType)}
        className="bg-gray-700 text-white p-1 text-lg"
      >
        <option value="wainwright">Wainwrights</option>
        <option value="munro">Munros</option>
      </select>
      <input
        name="search"
        className="bg-gray-700 text-white p-1 text-lg ml-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <span className="pl-2 text-xs">
        Ticked:{" "}
        <b>
          {tickCount.ticked} / {tickCount.total}
        </b>
      </span>
    </div>
  );
}

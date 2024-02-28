"use client";

import React from "react";
import { Search } from "./search";
import Map from "./map";
import { EditTicks } from "./edit-ticks";

export default function Ticker() {
  return (
    <>
      <Map />
      <Search />
      <EditTicks />
    </>
  );
}

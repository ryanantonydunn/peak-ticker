"use client";

import dynamic from "next/dynamic";
import React from "react";

export default function Home() {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("@/components/map"), {
        loading: () => <span>Loading...</span>,
        ssr: false,
      }),
    []
  );

  return (
    <main className="screen-h">
      <Map />
    </main>
  );
}

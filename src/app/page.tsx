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

  const [input, setInput] = React.useState("");

  return (
    <main className="screen-h">
      <Map search={input} />
      <input
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "300px",
          background: "rgb(var(--color-background))",
          padding: 10,
          zIndex: 99999,
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </main>
  );
}

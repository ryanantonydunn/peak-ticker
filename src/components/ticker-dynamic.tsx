import dynamic from "next/dynamic";

export const TickerDynamic = dynamic(() => import("@/components/ticker"), {
  ssr: false,
});

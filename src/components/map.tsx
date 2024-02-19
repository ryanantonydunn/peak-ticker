import { useFilteredPeaks, useTickedPeaks } from "@/store/hooks";
import { useStore } from "@/store/store";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";

export default function Map() {
  return (
    <MapContainer
      center={[54.5272, -3.0161]}
      zoom={0}
      style={{ height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Peaks />
    </MapContainer>
  );
}

function Peaks() {
  const togglePeakTick = useStore((state) => state.togglePeakTick);
  const peaks = useFilteredPeaks();
  const tickedPeaks = useTickedPeaks();
  const map = useMap();

  // zoom map to show new peaks
  React.useEffect(() => {
    if (peaks.length) {
      map.fitBounds(peaks.map((peak) => [peak.latitude, peak.longitude]));
    }
  }, [map, peaks]);

  // show or hide permanenet tooltips on zoom
  const [zoom, setZoom] = React.useState(0);
  const mapEvents = useMapEvents({
    zoom(e) {
      setZoom(e.target._zoom);
    },
    viewreset(e) {
      setZoom(e.target._zoom);
    },

    // remove last hovered peak if clicked
    click(e) {
      const targetElement = e.originalEvent.target as Element;
      // only remove if we are not clicking inside a tooltip
      if (
        [
          targetElement,
          targetElement.parentElement,
          targetElement.parentElement?.parentElement,
        ].every((el) => !el?.classList.contains("leaflet-tooltip"))
      ) {
        setLastHoveredPeak(null);
      }
    },
  });
  const areTooltipsPermanenet = zoom >= 13;

  // maintain tooltip for previously hovered peak
  const [lastHoveredPeak, setLastHoveredPeak] = React.useState<null | number>(
    null
  );
  React.useEffect(() => {
    setLastHoveredPeak(null);
  }, [peaks]);

  return peaks.map((peak, i) => {
    const isOpen = areTooltipsPermanenet || lastHoveredPeak === i;
    return (
      <CircleMarker
        key={peak.id}
        center={[peak.latitude, peak.longitude]}
        pathOptions={{
          color: !!tickedPeaks[peak.id] ? "blue" : "red",
        }}
        radius={10}
        eventHandlers={{
          mouseover: (e) => {
            // bring tooltips to front when hovering
            e.sourceTarget.bringToFront();

            // set this as last hovered peak
            setLastHoveredPeak(i);
          },
        }}
      >
        {isOpen && (
          <Tooltip permanent interactive direction="right" offset={[9, 0]}>
            <div className="flex items-center">
              <input
                type="checkbox"
                name={`peak-tick-${peak.id}`}
                checked={!!tickedPeaks[peak.id]}
                className="w-4 h-4 mr-2"
                onChange={() => {
                  togglePeakTick(peak.id);
                }}
              />
              {peak.name} (<b>{peak.height}m</b>){" "}
              {peak.url && (
                <small className="pl-2">
                  <a
                    target="_blank"
                    href={peak.url}
                    title="more information about this peak"
                  >
                    link
                  </a>
                </small>
              )}
            </div>
          </Tooltip>
        )}
      </CircleMarker>
    );
  });
}

"use client";

import {
  useFilteredPins,
  useGetPinColor,
  useIsRouteTicked,
  useOption,
} from "@/store/hooks";
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
      <Items />
    </MapContainer>
  );
}

function Items() {
  const getPinColor = useGetPinColor();
  const option = useOption();
  const toggleTick = useStore((state) => state.toggleTick);
  const pins = useFilteredPins();
  const isRouteTicked = useIsRouteTicked();
  const map = useMap();

  // zoom map to show new pins
  React.useEffect(() => {
    if (pins.length) {
      map.fitBounds(pins.map((pin) => [pin.latitude, pin.longitude]));
    }
  }, [map, pins]);

  // show or hide permanenet tooltips on zoom
  const [zoom, setZoom] = React.useState(0);
  const mapEvents = useMapEvents({
    zoom(e) {
      setZoom(e.target._zoom);
    },
    viewreset(e) {
      setZoom(e.target._zoom);
    },

    // remove last hovered item if clicked
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
        setLastHoveredPin(null);
      }
    },
  });
  const areTooltipsPermanenet = zoom >= 13;

  // maintain tooltip for previously hovered item
  const [lastHoveredPin, setLastHoveredPin] = React.useState<null | number>(
    null
  );
  React.useEffect(() => {
    setLastHoveredPin(null);
  }, [pins]);

  return pins.map((pin, i) => {
    const isOpen = areTooltipsPermanenet || lastHoveredPin === i;
    return (
      <CircleMarker
        key={pin.id}
        center={[pin.latitude, pin.longitude]}
        pathOptions={{
          color: getPinColor(pin),
        }}
        radius={10}
        eventHandlers={{
          mouseover: (e) => {
            // bring tooltips to front when hovering
            e.sourceTarget.bringToFront();

            // set this as last hovered pin
            setLastHoveredPin(i);
          },
        }}
      >
        {isOpen && (
          <Tooltip permanent interactive direction="right" offset={[9, 0]}>
            {pin.name && <h3 className="pb-1 font-bold">{pin.name}</h3>}
            {pin.routeHills.map((hill) => (
              <div className="flex items-center pb-1" key={hill.id}>
                <input
                  type="checkbox"
                  name={`item-tick-${hill.id}`}
                  checked={isRouteTicked(hill)}
                  className="w-4 h-4 mr-2"
                  onChange={() => {
                    toggleTick(hill.id, option.pinType);
                  }}
                />
                {hill.name} (<b>{hill.height}m</b>){" "}
                {hill.url && (
                  <small className="pl-2">
                    <a
                      target="_blank"
                      href={hill.url}
                      title="more information about this item"
                    >
                      link
                    </a>
                  </small>
                )}
              </div>
            ))}
            {pin.routeCrags.map((climb) => (
              <div className="flex items-center pb-1 last:pb-0" key={climb.id}>
                <input
                  type="checkbox"
                  name={`item-tick-${climb.id}`}
                  checked={isRouteTicked(climb)}
                  className="w-4 h-4 mr-2"
                  onChange={() => {
                    toggleTick(climb.id, option.pinType);
                  }}
                />
                {climb.name}
                {climb.stars} (<b>{climb.grade}</b>)&nbsp;
                <small className="pl-2">
                  <a
                    target="_blank"
                    href={`https://www.ukclimbing.com/logbook/c.php?i=${climb.id}`}
                    title="View on UKC"
                  >
                    UKC
                  </a>
                </small>
              </div>
            ))}
          </Tooltip>
        )}
      </CircleMarker>
    );
  });
}

import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import facets from "./facets";
import { getBooleanColor, getPartyColor } from "./utils";

const Legend = ({ items, facet }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "topright" });
    const uniqueParties = Array.from(
      new Set(items.map((i) => i[facet.colorProp]))
    );

    legend.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "grid grid-cols-4 gap-1 max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
      );
      div.innerHTML = "<h4 class='font-semibold col-span-4'>Légende</h4>";
      uniqueParties.forEach((label) => {
        const color =
          facet === facets.leg24
            ? getBooleanColor(label)
            : getPartyColor(label);

        let displayLabel;
        if (facet === facets.leg24) {
          displayLabel = label === "True" ? "Swing" : "Non Swing";
        } else {
          displayLabel = label;
        }

        div.innerHTML += `<i style="background:${color}" class="w-[12px] h-[12px] float-left opacity-70 mr-2 col-span-1"></i> <span class="col-span-3">${displayLabel}</span>`;
      });
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, items, facet]);

  return null;
};

export default Legend;

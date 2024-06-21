import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import "./App.css";
import circos from "./circos.json";
import facets from "./facets";
import { SidePanel } from "./SidePanel";
import { getPartyColor } from "./utils";

function circoColor(feature, d4gdata, facet) {
  const d4gCircoData = d4gdata.filter(
    (d) =>
      d["Code du département"] === feature.properties.code_dpt &&
      d["Code de la circonscription"] === feature.properties.num_circ
  )[0];

  if (!d4gCircoData) return; // because

  if (facet == facets.leg24) {
    const fillColor =
      d4gCircoData[facet.colorProp] === "True" ? "#22c55e" : "#ef4444";
    return { fillColor, fillOpacity: 0.8, weight: 1 };
  }

  const fillColor = getPartyColor(d4gCircoData[facet.colorProp]);
  return { fillColor, fillOpacity: 0.8, weight: 1 };
}

function App() {
  const center = [45.7870226, 3.034855];
  const [selectedCirco, setSelectedCirco] = useState(null);

  const [facet, setFacet] = useState(facets.euro19);

  const [d4gdata, setD4gData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          "https://circos.services.dataforgood.fr/circos.json"
        );
        const jsonData = await resp.json();
        setD4gData(jsonData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!loading ? (
        <div className="flex flex-col h-full gap-4 md:flex-row">
          <SidePanel
            selectedCirco={selectedCirco}
            d4gdata={d4gdata}
            facet={facet}
            setFacet={setFacet}
          />

          <MapContainer
            className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow min-h-96 md:w-2/3 dark:bg-gray-800 dark:border-gray-700"
            center={center}
            zoom={6}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={circos}
              eventHandlers={{
                click: (event) => {
                  setSelectedCirco({
                    latLng: Object.values(event.latlng),
                    properties: event.sourceTarget.feature.properties,
                  });
                },
              }}
              style={(feat) => circoColor(feat, d4gdata, facet)}
            />
          </MapContainer>
        </div>
      ) : null}
    </>
  );
}

export default App;

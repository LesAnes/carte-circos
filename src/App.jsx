import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import "./App.css";
import circos from "./circos.json";
import facets from "./facets";
import Legend from "./Legend";
import { SidePanel } from "./SidePanel";
import { getBooleanColor, getPartyColor } from "./utils";

function circoColor(feature, d4gdata, facet) {
  const d4gCircoData = d4gdata.filter(
    (d) =>
      d["Code du département"] === feature.properties.code_dpt &&
      d["Code de la circonscription"] === feature.properties.num_circ
  )[0];

  if (!d4gCircoData) return; // because

  const fillColor =
    facet === facets.leg24
      ? getBooleanColor(d4gCircoData[facet.colorProp])
      : getPartyColor(d4gCircoData[facet.colorProp]);

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
        const resp = await fetch(import.meta.env.VITE_CIRCOS_DATA_URL);
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
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3 md:flex-row">
          <SidePanel
            className="col-span-1"
            selectedCirco={selectedCirco}
            d4gdata={d4gdata}
            facet={facet}
            setFacet={setFacet}
          />

          <MapContainer
            className="h-full col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow min-h-96 dark:bg-gray-800 dark:border-gray-700"
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
            <Legend items={d4gdata} facet={facet} />
          </MapContainer>
        </div>
      ) : null}
    </>
  );
}

export default App;

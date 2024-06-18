import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import "./App.css";

import circos from "./circos.json";

const facets = {
  leg22: {
    label: "Législatives 2022",
    colorProp: "gagnant_leg22",
  },
  euro24: {
    label: "Européennes 2024",
    colorProp: "gagnant_euro",
  },
};

const ResultFormatter = ({ label, percentage, trend }) => {
  const trendColor =
    trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-500";
  return (
    <div className="flex items-center justify-between">
      <span className="text-2xl">{label}</span>
      <span className="text-2xl font-bold">{percentage}%</span>
      <span className={`text-sm ${trendColor}`}>{trend}</span>
    </div>
  );
};

function partyColor(party) {
  switch (party) {
    case "RN":
      return "#0D378A";
    case "ENS":
      return "#ffeb00";
    case "NFP":
      return "#cc2443";
    case "LR":
      return "#0066CC";
  }
}

function circoColor(feature, d4gdata, facet) {
  const d4gCircoData = d4gdata.filter(
    (d) => d.dept_circo_code === feature.properties.ID
  )[0];

  if (!d4gCircoData) return; // because

  const fillColor = partyColor(d4gCircoData[facet.colorProp]);
  return { fillColor, fillOpacity: 0.8, weight: 1 };
}

function SelectedCircoResults({ properties, d4gdata, facet }) {
  const d4gCircoData = d4gdata.filter(
    (d) => d.dept_circo_code === properties.ID
  )[0];

  return (
    <div>
      <ul>
        <li>
          <b>Region :</b> {properties.nom_reg}
        </li>
        <li>
          <b>Département :</b> {properties.nom_dpt}
        </li>
        <li>
          <b>Circo n° :</b> {properties.num_circ}
        </li>

        {facet === facets.leg22 ? (
          <>
            <li>
              <b>Député sortant :</b> {d4gCircoData?.depute_sortant} (
              {d4gCircoData?.gagnant_leg22})
            </li>
            <div className="p-4">
              <div className="grid gap-4">
                <h6 className="text-xl">1er tour</h6>
                <ResultFormatter
                  label="NFP"
                  percentage={d4gCircoData?.NFP_leg22t1}
                />
                <ResultFormatter
                  label="ENS"
                  percentage={d4gCircoData?.ENS_leg22t1}
                />
                <ResultFormatter
                  label="RN"
                  percentage={d4gCircoData?.RN_leg22t1}
                />
                <div className="text-sm text-gray-600 my-2">
                  <li>
                    <b>Inscrits :</b> {d4gCircoData?.inscrits_leg22}
                  </li>
                  <li>
                    <b>Abstention :</b> {d4gCircoData?.abstentions_leg22t1}
                  </li>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                <h6 className="text-xl">2nd tour</h6>
                <ResultFormatter
                  label="NFP"
                  percentage={d4gCircoData?.NFP_leg22t2}
                  trend={d4gCircoData?.ecart_leg22}
                />
                <ResultFormatter
                  label="ENS"
                  percentage={d4gCircoData?.ENS_leg22t2}
                />
                <ResultFormatter
                  label="RN"
                  percentage={d4gCircoData?.RN_leg22t2}
                />

                <div className="text-sm text-gray-600 my-2">
                  <li>
                    <b>Inscrits :</b> {d4gCircoData?.inscrits_leg22}
                  </li>
                  <li>
                    <b>Abstention :</b> {d4gCircoData?.abstentions_leg22t2}
                  </li>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {facet === facets.euro24 ? (
          <>
            <div className="p-4">
              <li>
                <b>Vainqueur :</b> {d4gCircoData?.gagnant_euro}
              </li>
              <div className="grid gap-4 my-2">
                <ResultFormatter
                  label="NFP"
                  percentage={d4gCircoData?.NFP_euro}
                  trend={d4gCircoData?.dyn_NFP}
                />
                <ResultFormatter
                  label="ENS"
                  percentage={d4gCircoData?.ENS_euro}
                  trend={d4gCircoData?.dyn_ENS}
                />
                <ResultFormatter
                  label="RN"
                  percentage={d4gCircoData?.RN_euro}
                  trend={d4gCircoData?.dyn_RN}
                />
              </div>

              <div className="text-sm text-gray-600 my-2">
                <li>
                  <b>Inscrits :</b> {d4gCircoData?.inscrits_euro}
                </li>
                <li>
                  <b>Abstention :</b> {d4gCircoData?.abstentions_euro}
                </li>
              </div>
            </div>
          </>
        ) : null}
      </ul>
    </div>
  );
}

function SidePanel({ selectedCirco, d4gdata, facet, setFacet }) {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Analyse des circonscriptions
      </h5>
      <label
        htmlFor="countries"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Scrutin
      </label>
      <select
        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(e) => setFacet(facets[e.target.value])}
      >
        {Object.entries(facets).map(([short, details]) => (
          <option key={short} value={short}>
            {details.label}
          </option>
        ))}
      </select>

      {selectedCirco ? (
        <>
          <SelectedCircoResults
            properties={selectedCirco.properties}
            d4gdata={d4gdata}
            facet={facet}
          />
        </>
      ) : (
        <p className="text-sm text-gray-500">
          Sélectionnez une circonscription
        </p>
      )}
    </div>
  );
}

function App() {
  const center = [45.7870226, 3.034855];
  const [selectedCirco, setSelectedCirco] = useState(null);

  const [facet, setFacet] = useState(facets.leg22);

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
        <div className="h-full flex flex-col md:flex-row gap-4">
          <SidePanel
            selectedCirco={selectedCirco}
            d4gdata={d4gdata}
            facet={facet}
            setFacet={setFacet}
          />

          <MapContainer
            className="h-full min-h-96 md:w-2/3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
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

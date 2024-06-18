import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, Popup, TileLayer } from "react-leaflet";
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

const ResultTable = ({ nfp, ens, rn, abst }) => {
  return (
    <table>
      <caption>Résultats</caption>
      <thead>
        <tr>
          <th scope="col">NFP</th>
          <th scope="col">ENS</th>
          <th scope="col">RN</th>
          <th scope="col">Abstention</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{nfp}</td>
          <td>{ens}</td>
          <td>{rn}</td>
          <td>{abst}</td>
        </tr>
      </tbody>
    </table>
  );
};

const PopupChildren = (properties, d4gdata, facet) => {
  const d4gCircoData = d4gdata.filter(
    (d) => d.dept_circo_code === properties.ID
  )[0];

  return (
    <div>
      <ul style={{ "padding-left": "1rem" }}>
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
              <b>Député sortant :</b> {d4gCircoData.depute_sortant} (
              {d4gCircoData.gagnant_leg22})
            </li>
            <li>
              <b>Abstention 1er tour:</b> {d4gCircoData.abstentions_leg22t1}
            </li>
            <li>
              <b>Abstention 2nd tour:</b> {d4gCircoData.abstentions_leg22t2}
            </li>
            <span>1er tour</span>
            <ResultTable
              nfp={d4gCircoData.NFP_leg22t1}
              ens={d4gCircoData.ENS_leg22t1}
              rn={d4gCircoData.RN_leg22t1}
              abst={d4gCircoData.abstentions_leg22t1}
            />
            <span>2nd tour</span>
            <ResultTable
              nfp={d4gCircoData.NFP_leg22t2}
              ens={d4gCircoData.ENS_leg22t2}
              rn={d4gCircoData.RN_leg22t2}
              abst={d4gCircoData.abstentions_leg22t2}
            />
          </>
        ) : null}
        {facet === facets.euro24 ? (
          <>
            <li>
              <b>Vainqueur :</b> {d4gCircoData.gagnant_euro}
            </li>
            <li>
              <b>Abstention :</b> {d4gCircoData.abstentions_euro}
            </li>
            <ResultTable
              nfp={d4gCircoData.NFP_euro}
              ens={d4gCircoData.ENS_euro}
              rn={d4gCircoData.RN_euro}
              abst={d4gCircoData.abstentions_euro}
            />
          </>
        ) : null}
      </ul>
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
        console.log(jsonData);
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
      <div>
        <select onChange={(e) => setFacet(facets[e.target.value])}>
          {Object.entries(facets).map(([short, details]) => (
            <option key={short} value={short}>
              {details.label}
            </option>
          ))}
        </select>
      </div>
      {!loading ? (
        <MapContainer
          style={{ width: "100%", height: "100%" }}
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

          {selectedCirco && (
            <Popup position={selectedCirco.latLng}>
              {PopupChildren(selectedCirco.properties, d4gdata, facet)}
            </Popup>
          )}
        </MapContainer>
      ) : null}
    </>
  );
}

export default App;

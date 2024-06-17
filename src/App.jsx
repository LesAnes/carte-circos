import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import { useState } from 'react';
import "./App.css";

import circos from "./circos.json";

const PopupChildren = (properties) => {
  return (
    <div>
      <ul style={{'padding-left': '1rem' }}>
        <li><b>Region :</b> { properties.nom_reg }</li>
        <li><b>Département :</b> { properties.nom_dpt }</li>
        <li><b>Circo n° :</b> { properties.num_circ }</li>
      </ul>
    </div>
  );
};

function App() {
  const center = [48.8588254, 2.2644636];
  const [selectedCirco, setSelectedCirco] = useState(null);

  return (
    <MapContainer style={{ width: "100%", height: "100%" }} center={center} zoom={10} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={circos} eventHandlers={{
        click: (event) => {
          setSelectedCirco({
            latLng: Object.values(event.latlng),
            properties: event.sourceTarget.feature.properties,
          })
        },
      }} />

      {selectedCirco &&
        <Popup position={selectedCirco.latLng}>
          { PopupChildren(selectedCirco.properties) }
        </Popup>
      }
    </MapContainer>
  );
}

export default App;

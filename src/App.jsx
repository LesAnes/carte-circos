import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import "./App.css";

import circos from "./circos.json";

function App() {
  const center = [48.8588254, 2.2644636];
  return (
    <MapContainer center={center} zoom={10} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={circos} />
    </MapContainer>
  );
}

export default App;

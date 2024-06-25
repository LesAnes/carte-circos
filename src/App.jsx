import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, Popup } from "react-leaflet";
import "./App.css";
import circos from "./circos.json";
import facets from "./facets";
import Legend from "./Legend";
import { InfoCirco } from "./InfoCirco";
import { RedirectionLink } from "./RedirectionLink";
import { getBooleanColor, getPartyColor } from "./utils";
import tripImage from './assets/caravan.svg';
import franceImage from './assets/france.svg';
import emailImage from './assets/email.svg';
import callImage from './assets/call.svg';

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
        const resp = await fetch(
          "https://circos.services.room303.dev/circos.json"
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
        <div className="flex flex-col h-full">
          <h1 className="text-left font-black italic text-[#fd454d] uppercase text-5xl leading-10">Mettez une majoritée Front Populaire à l'Assemblée</h1>
          <div className="grid grid-cols-1 flex-1 gap-4 md:grid-cols-2 md:flex-row">
            <div className="flex flex-col">
              <h2 className="text-left font-black">Rejoignez les boucles de campagne dans les circos clés et participez à une action</h2>
              <MapContainer
                className="flex-1 col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow min-h-96 dark:bg-gray-800 dark:border-gray-700"
                center={center}
                zoom={5}
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

                {selectedCirco &&
                  <Popup
                    className="custom-popup"
                    position={selectedCirco.latLng}>
                    {/* <SidePanel
                      className="col-span-1"
                      selectedCirco={selectedCirco}
                      d4gdata={d4gdata}
                      facet={facet}
                      setFacet={setFacet}
                    /> */}
                    <InfoCirco
                      selectedCirco={selectedCirco}
                    />
                  </Popup>
                }
              </MapContainer>
              <h2 className="text-left font-black">Vous voulez ajouter une action ? C'est ici !</h2>
            </div>
            <div className="flex flex-col justify-center">
              <RedirectionLink>
                <div className="flex-none w-32">
                  <img src={tripImage} alt="trip" />
                </div>
                <div className="flex-1 text-2xl text-left hyphens-auto">
                  Participe à un convoi spécial
                </div>
              </RedirectionLink>

              <RedirectionLink>
                <div className="flex-none w-32">
                  <img src={callImage} alt="call" />
                </div>
                <div className="flex-1 text-2xl text-left hyphens-auto">
                  Fais du phoning
                </div>
              </RedirectionLink>

              <RedirectionLink>
                <div className="flex-1 text-2xl text-left hyphens-auto">
                  D'autres actions pour faire basculer l'élection
                </div>
                <div className="flex-none w-32">
                  <img src={emailImage} alt="email" />
                </div>
              </RedirectionLink>

              <RedirectionLink>
                <div className="flex-1 text-2xl text-left hyphens-auto">
                  La carte de toutes les circonscriptions
                </div>
                <div className="flex-none w-32">
                  <img src={franceImage} alt="france" />
                </div>
              </RedirectionLink>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;

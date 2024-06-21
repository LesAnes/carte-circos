import facets from "./facets";
import { getDatanUrl, getTrendColor } from "./utils";

const ResultFormatter = ({ label, percentage, trend }) => {
  const trendColor = getTrendColor(trend);

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-2xl">{label}</span>
      <span className="text-2xl font-bold">{percentage}%</span>
      <span className={`text-sm ${trendColor}`}>{trend}</span>
    </div>
  );
};

const CandidateFormatter = ({ label, candidate }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-2xl">{label}</span>
      <span className="text-2xl font-bold">{candidate}</span>
    </div>
  );
};

const TrendFormatter = ({ label, trend }) => {
  const trendColor = getTrendColor(trend);

  return (
    <div className="flex items-center justify-between gap-2">
      <span>{label}</span>
      <span className={`text-xl ${trendColor}`}>
        {parseFloat(trend).toFixed(2)}
      </span>
    </div>
  );
};

function SelectedCircoResults({ properties, d4gdata, facet }) {
  const d4gCircoData = d4gdata.find(
    (d) =>
      d["Code du département"] === properties.code_dpt &&
      d["Code de la circonscription"] === properties.num_circ
  );

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
        {facet === facets.euro19 ? (
          <>
            <li>
              <b>Vainqueur :</b> {d4gCircoData?.gagnant_eur19}
            </li>
            <div className="p-4">
              <div className="grid gap-4">
                <h6 className="text-xl">1er tour</h6>
                <ResultFormatter
                  label="NFP"
                  percentage={d4gCircoData?.NFP_euro19}
                />
                <ResultFormatter
                  label="ENS"
                  percentage={d4gCircoData?.ENS_euro19}
                />
                <ResultFormatter
                  label="RN"
                  percentage={d4gCircoData?.RN_euro19}
                />
                <div className="my-2 text-sm text-gray-600">
                  <li>
                    <b>Inscrits :</b> {d4gCircoData?.inscrits_euro19}
                  </li>
                  <li>
                    <b>Abstention :</b> {d4gCircoData?.abstentions_euro19}
                  </li>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {facet === facets.leg22 ? (
          <>
            <li>
              <b>Député sortant :</b> {d4gCircoData?.depute_sortant} (
              {d4gCircoData?.gagnant_leg22})
            </li>
            <a
              href={getDatanUrl(
                d4gCircoData?.["Code du département"],
                d4gCircoData?.["Département"],
                d4gCircoData?.depute_sortant
              )}
              target="_blank"
            >
              Voir son activité parlementaire
            </a>
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
                <div className="my-2 text-sm text-gray-600">
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

                <div className="my-2 text-sm text-gray-600">
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
                <b>Vainqueur :</b> {d4gCircoData?.gagnant_euro24}
              </li>
              <div className="grid gap-4 my-2">
                <ResultFormatter
                  label="NFP"
                  percentage={d4gCircoData?.NFP_euro24}
                  trend={d4gCircoData?.dyn_NFP}
                />
                <ResultFormatter
                  label="ENS"
                  percentage={d4gCircoData?.ENS_euro24}
                  trend={d4gCircoData?.dyn_ENS}
                />
                <ResultFormatter
                  label="RN"
                  percentage={d4gCircoData?.RN_euro24}
                  trend={d4gCircoData?.dyn_RN}
                />
              </div>

              <div className="my-2 text-sm text-gray-600">
                <li>
                  <b>Inscrits :</b> {d4gCircoData?.inscrits_euro24}
                </li>
                <li>
                  <b>Abstention :</b> {d4gCircoData?.abstentions_euro24}
                </li>
              </div>
            </div>
          </>
        ) : null}
        {facet === facets.leg24 ? (
          <>
            <div className="p-4">
              <div className="grid gap-4">
                <li>
                  <b>Candidats :</b>
                </li>
                <CandidateFormatter
                  label="NFP"
                  candidate={d4gCircoData?.candidat_NFP}
                />
                <CandidateFormatter
                  label="ENS"
                  candidate={d4gCircoData?.candidat_ENS}
                />
                <CandidateFormatter
                  label="RN"
                  candidate={d4gCircoData?.candidat_RN}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                <li>
                  <b>Statistiques :</b>
                </li>
                <TrendFormatter
                  label="Réserve NFP RN Européennes"
                  trend={d4gCircoData?.ratio_reserve_diff_NFP_RN_euro}
                />
                <TrendFormatter
                  label="Réserve NFP RN Législatives"
                  trend={d4gCircoData?.ratio_reserve_diff_NFP_RN_leg22}
                />
                <TrendFormatter
                  label="Réserve ENS RN Européennes"
                  trend={d4gCircoData?.ratio_reserve_diff_ENS_RN_euro}
                />
                <TrendFormatter
                  label="Réserve ENS RN Législatives"
                  trend={d4gCircoData?.ratio_reserve_diff_ENS_RN_leg22}
                />
              </div>
            </div>
            <a href={d4gCircoData?.analyse_electorale} target="_blank">
              Analyse électorale
            </a>
          </>
        ) : null}
      </ul>
    </div>
  );
}

export function SidePanel({ selectedCirco, d4gdata, facet, setFacet }) {
  return (
    <div className="max-w-sm p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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

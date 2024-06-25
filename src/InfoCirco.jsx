function SelectedCircoResults({ properties }) {
  return (
    <div className="dark:text-white">
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
      </ul>
    </div>
  );
}

export function InfoCirco({ selectedCirco }) {
  return (
    <div className="w-full max-w-sm p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-800">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Circonscription
      </h5>
      {selectedCirco ? (
        <>
          <SelectedCircoResults
            properties={selectedCirco.properties}
          />
          <p className="col-span-3 py-1 text-xs text-gray-400">
            Crédit{" "}
            <a href="https://dataforgood.fr" target="_blank">
              Data For Good
            </a>{" "}
            pour les données
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          Sélectionnez une circonscription
        </p>
      )}
    </div>
  );
}

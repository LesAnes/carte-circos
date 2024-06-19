export function sluggify(text, removeInnerCarets = false) {
  // Fonction pour normaliser les caractères accentués
  function normalizeAccents(str) {
    const accents = "ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÿÑñÇç";
    const without = "AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOOooooooUUUUuuuuyNnCc";
    return str
      .split("")
      .map((letter, index) => {
        const accentIndex = accents.indexOf(letter);
        return accentIndex !== -1 ? without[accentIndex] : letter;
      })
      .join("");
  }

  // Convertir en minuscules
  text = text.toLowerCase();

  // Normaliser les accents
  text = normalizeAccents(text);

  // Supprimer les tirets dans les noms composés
  if (removeInnerCarets) {
    text = text.replace(/-/g, "");
  }

  // Remplacer les espaces par des tirets pour concaténer prénom et nom
  text = text.replace(/\s+/g, "-");

  return text;
}

export function getDatanUrl(department_code, department, deputee_name) {
  const sluggifiedDepartment = sluggify(department);
  const sluggifiedDeputeeName = sluggify(deputee_name, true);
  return `https://datan.fr/deputes/${sluggifiedDepartment}-${department_code}/depute_${sluggifiedDeputeeName}`;
}

export function getPartyColor(party) {
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

export function getTrendColor(trend) {
  return trend > 0
    ? "text-green-500"
    : trend < 0
    ? "text-red-500"
    : "text-gray-500";
}

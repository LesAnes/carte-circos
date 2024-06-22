import { getPartyColor } from "./utils";

export default {
  euro19: {
    label: "Européennes 2019",
    colorProp: "gagnant_eur19",
    legendItems: {
      RN: getPartyColor("RN"),
      ENS: getPartyColor("ENS"),
      "EUROPE ÉCOLOGIE": getPartyColor("EUROPE ÉCOLOGIE"),
      LFI: getPartyColor("LFI"),
      LR: getPartyColor("LR"),
      Autre: "#3388ff",
    },
  },
  leg22: {
    label: "Législatives 2022",
    colorProp: "gagnant_leg22",
    legendItems: {
      NFP: getPartyColor("NFP"),
      ENS: getPartyColor("ENS"),
      LR: getPartyColor("LR"),
      RN: getPartyColor("RN"),
      REG: getPartyColor("REG"),
      Autre: "#3388ff",
    },
  },
  euro24: {
    label: "Européennes 2024",
    colorProp: "gagnant_euro24",
    legendItems: {
      NFP: getPartyColor("NFP"),
      ENS: getPartyColor("ENS"),
      LR: getPartyColor("LR"),
      RN: getPartyColor("RN"),
    },
  },
  leg24: {
    label: "Législatives 2024",
    colorProp: "swing_circo",
  },
};

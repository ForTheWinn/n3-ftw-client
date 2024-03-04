import {
  NEON,
  NEO_LINE,
  NEO_LINE_MOBILE,
  O3,
  ONE_GATE,
} from "../../../../../packages/neo/consts";

export const getWalletIcon = (key: string) => {
  let svg = "";
  switch (key) {
    case O3:
      svg = "/icons/o3.svg";
      break;
    case NEO_LINE:
      svg = "/icons/neoline.svg";
      break;
    case NEO_LINE_MOBILE:
      svg = "/icons/neoline.svg";
      break;
    case NEON:
      svg = "/icons/neon.svg";
      break;
    case ONE_GATE:
      svg = "/icons/onegate.png";
      break;
  }
  return svg;
};

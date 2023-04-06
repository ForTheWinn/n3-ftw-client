import { CONSTS } from "../../../../../packages/neo";

export const getWalletIcon = (key: string) => {
  let svg = "";
  switch (key) {
    case CONSTS.O3:
      svg = "/icons/o3.svg";
      break;
    case CONSTS.NEO_LINE:
      svg = "/icons/neoline.svg";
      break;
    case CONSTS.NEO_LINE_MOBILE:
      svg = "/icons/neoline.svg";
      break;
    case CONSTS.NEON:
      svg = "/icons/neon.svg";
      break;
    case CONSTS.ONE_GATE:
      svg = "/icons/onegate.png";
      break;
  }
  return svg;
};

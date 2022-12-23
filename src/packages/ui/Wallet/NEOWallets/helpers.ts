import { CONST } from "../../../neo";

export const getWalletIcon = (key: string) => {
  let svg = "";
  switch (key) {
    case CONST.DEV:
      svg = "/icons/dev.png";
      break;
    case CONST.O3:
      svg = "/icons/o3.svg";
      break;
    case CONST.NEO_LINE:
      svg = "/icons/neoline.svg";
      break;
    case CONST.NEON:
      svg = "/icons/neon.svg";
      break;
    case CONST.ONE_GATE:
      svg = "/icons/onegate.png";
      break;
  }
  return svg;
};

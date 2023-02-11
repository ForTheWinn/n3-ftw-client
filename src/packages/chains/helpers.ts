import { POLYGON_CHAIN } from "./consts";

export const getChainId = (chain: string): number => {
  switch (chain) {
    case POLYGON_CHAIN:
      return 80001;
    default:
      return 1;
  }
};

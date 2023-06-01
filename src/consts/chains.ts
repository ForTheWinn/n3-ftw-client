import { MAINNET, TESTNET } from "./global";

export const NEO_CHAIN = "NEO_CHAIN";
export const POLYGON_CHAIN = "POLYGON_CHAIN";

export type CHAINS = typeof NEO_CHAIN | typeof POLYGON_CHAIN;

export const LIST = [NEO_CHAIN, POLYGON_CHAIN];

export const CONFIGS = {
  [MAINNET]: {
    [NEO_CHAIN]: {
      label: "Neo",
      color: "primary",
      icon: "/symbols/neo.svg",
      chainId: 888
    },
    [POLYGON_CHAIN]: {
      label: "Polygon",
      color: "info",
      icon: "/symbols/matic.png",
      chainId: 137
    }
  },
  [TESTNET]: {
    [NEO_CHAIN]: {
      label: "Neo Testnet",
      color: "primary",
      icon: "/symbols/neo.svg",
      chainId: 889
    },
    [POLYGON_CHAIN]: {
      label: "Polygon Mumbai",
      color: "info",
      icon: "/symbols/matic.png",
      chainId: 80001
    }
  }
};

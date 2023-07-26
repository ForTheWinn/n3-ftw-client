import {
  MAINNET,
  NEO_CHAIN,
  NEO_MAINNET_CHAIN_ID,
  NEO_TESTNET_CHAIN_ID,
  POLYGON_CHAIN,
  POLYGON_MAINNET_CHAIN_ID,
  POLYGON_TESTNET_CHAIN_ID,
  TESTNET,
} from "./global";

export type CHAINS = typeof NEO_CHAIN | typeof POLYGON_CHAIN;

export const LIST = [NEO_CHAIN, POLYGON_CHAIN];

export const CONFIGS = {
  [MAINNET]: {
    [NEO_CHAIN]: {
      label: "Neo",
      color: "primary",
      icon: "/symbols/neo.svg",
      chainId: NEO_MAINNET_CHAIN_ID,
    },
    [POLYGON_CHAIN]: {
      label: "Polygon",
      color: "info",
      icon: "/symbols/matic.png",
      chainId: POLYGON_MAINNET_CHAIN_ID,
    },
  },
  [TESTNET]: {
    [NEO_CHAIN]: {
      label: "Neo Testnet",
      color: "primary",
      icon: "/symbols/neo.svg",
      chainId: NEO_TESTNET_CHAIN_ID,
    },
    [POLYGON_CHAIN]: {
      label: "Polygon Mumbai",
      color: "info",
      icon: "/symbols/matic.png",
      chainId: POLYGON_TESTNET_CHAIN_ID,
    },
  },
};

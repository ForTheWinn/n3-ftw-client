import { ETH_CHAIN, MAINNET, NEO_CHAIN, POLYGON_CHAIN, TESTNET } from "./global";

export const SMITH_FEE = {
  [NEO_CHAIN]: {
    [MAINNET]: 1000_00000000,
    [TESTNET]: 1000_00000000,
  },
  [POLYGON_CHAIN]: {
    [MAINNET]: 1000_00000000,
    [TESTNET]: 1_00000000,
  },
  [ETH_CHAIN]: {
    [MAINNET]: 0,
  },
};

export const SMITH_FEE_FORMATTED = {
  [NEO_CHAIN]: {
    [MAINNET]: 1000,
    [TESTNET]: 1000,
  },
  [POLYGON_CHAIN]: {
    [MAINNET]: 1000,
    [TESTNET]: 1,
  },
  [ETH_CHAIN]: {
    [MAINNET]: 0,
  },
};

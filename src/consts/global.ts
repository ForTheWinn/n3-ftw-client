export const NEO_CHAIN = "NEO_CHAIN";
export const POLYGON_CHAIN = "POLYGON_CHAIN";
export const NEO_MAINNET_CHAIN_ID = 888;
export const POLYGON_MAINNET_CHAIN_ID = 137;
export const NEO_TESTNET_CHAIN_ID = 889;
export const POLYGON_TESTNET_CHAIN_ID = 80001;

export const TESTNET = "N3TestNet";
export const MAINNET = "N3MainNet";

export const SWAP = "SWAP";
export const FARM = "FARM";
export const BRIDGE = "BRIDGE";
export const SMITH = "SMITH";

export const NEP_LOGO = "/symbols/nep.png";
export const UNKNOWN_TOKEN_IMAGE = "/symbols/unknown.png";

export const ALCHEMY_KEY = {
  POLYGON_CHAIN: {
    [MAINNET]: process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY,
    [TESTNET]: process.env.REACT_APP_ALCHEMY_POLYGON_TESTNET_API_KEY,
  },
};

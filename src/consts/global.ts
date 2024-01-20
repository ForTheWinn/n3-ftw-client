export const NEO_CHAIN = "NEO_CHAIN";
export const ETH_CHAIN = "ETH_CHAIN";
export const POLYGON_CHAIN = "POLYGON_CHAIN";
export const NEOX_CHAIN = "NEOX_CHAIN";

export const NEO_MAINNET_CHAIN_ID = 888;
export const POLYGON_MAINNET_CHAIN_ID = 137;
export const ETH_MAINNET_CHAIN_ID = 1;
export const NEOX_MAINNET_CHAIN_ID = 12227329;

export const NEOX_TESTNET_CHAIN_ID = 12227329;
export const NEO_TESTNET_CHAIN_ID = 889;
export const POLYGON_TESTNET_CHAIN_ID = 80001;
export const ETH_TESTNET_CHAIN_ID = 5;

export const TESTNET = "N3TestNet";
export const MAINNET = "N3MainNet";

export const SWAP = "SWAP";
export const FARM = "FARM";
export const BRIDGE = "BRIDGE";
export const SMITH = "SMITH";

export const ETHEREUM_LOGO = "/symbols/eth.png";
export const POLYGON_LOGO = "/symbols/matic.png";
export const NEOX_LOGO = "/symbols/neo.svg";
export const NEP_LOGO = "/symbols/nep.png";
export const NEO_LOGO = "/symbols/neo.svg";
export const UNKNOWN_TOKEN_IMAGE = "/symbols/unknown.png";
export const FTW_LOGO_URL = "/logo/FTW_512_512.svg";

export const ALCHEMY_KEY = {
  ETH_CHAIN: {
    [MAINNET]: process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY,
    [TESTNET]: process.env.REACT_APP_ALCHEMY_POLYGON_TESTNET_API_KEY,
  },
  POLYGON_CHAIN: {
    [MAINNET]: process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY,
    [TESTNET]: process.env.REACT_APP_ALCHEMY_POLYGON_TESTNET_API_KEY,
  },
};

export const STATUS_STATE = {
  isProcessing: false,
  success: false,
  error: "",
};

export const BLOCK_TIME = {
  [POLYGON_MAINNET_CHAIN_ID]: 2,
  [ETH_MAINNET_CHAIN_ID]: 15,
  [POLYGON_TESTNET_CHAIN_ID]: 2,
  [ETH_TESTNET_CHAIN_ID]: 15,
};

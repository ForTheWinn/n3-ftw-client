import {
  ETH_CHAIN,
  ETH_MAINNET_CHAIN_ID,
  ETH_TESTNET_CHAIN_ID,
  MAINNET,
  NEOX_CHAIN,
  NEOX_LOGO,
  NEOX_MAINNET_CHAIN_ID,
  NEOX_TESTNET_CHAIN_ID,
  NEO_CHAIN,
  NEO_LOGO,
  NEO_MAINNET_CHAIN_ID,
  NEO_TESTNET_CHAIN_ID,
  POLYGON_CHAIN,
  POLYGON_LOGO,
  POLYGON_MAINNET_CHAIN_ID,
  POLYGON_TESTNET_CHAIN_ID,
  TESTNET,
} from "./global";

export type CHAINS =
  | typeof NEO_CHAIN
  | typeof POLYGON_CHAIN
  | typeof ETH_CHAIN
  | typeof NEOX_CHAIN;

export const LIST = [NEO_CHAIN, ETH_CHAIN, POLYGON_CHAIN, NEOX_CHAIN];

export const CONFIGS = {
  [MAINNET]: {
    [NEO_CHAIN]: {
      label: "Neo",
      color: "primary",
      icon: NEO_LOGO,
      chainId: NEO_MAINNET_CHAIN_ID,
    },
    [ETH_CHAIN]: {
      label: "Ethereum",
      color: "dark",
      icon: "/symbols/eth.png",
      chainId: ETH_MAINNET_CHAIN_ID,
    },
    [POLYGON_CHAIN]: {
      label: "Polygon",
      color: "info",
      icon: POLYGON_LOGO,
      chainId: POLYGON_MAINNET_CHAIN_ID,
    },
    [NEOX_CHAIN]: {
      label: "Neo X",
      color: "primary",
      icon: NEOX_LOGO,
      chainId: NEOX_MAINNET_CHAIN_ID,
    },
  },
  [TESTNET]: {
    [NEO_CHAIN]: {
      label: "Neo Testnet",
      color: "primary",
      icon: NEO_LOGO,
      chainId: NEO_TESTNET_CHAIN_ID,
    },
    [ETH_CHAIN]: {
      label: "Goerli",
      color: "dark",
      icon: "/symbols/eth.png",
      chainId: ETH_TESTNET_CHAIN_ID,
    },
    [POLYGON_CHAIN]: {
      label: "Polygon Mumbai",
      color: "info",
      icon: POLYGON_LOGO,
      chainId: POLYGON_TESTNET_CHAIN_ID,
    },
    [NEOX_CHAIN]: {
      label: "Neo X Testnet",
      color: "primary",
      icon: POLYGON_LOGO,
      chainId: NEOX_TESTNET_CHAIN_ID,
    },
  },
};

// Define your custom chain
export const NEOX_MAINNET_CHAIN_DETAIL = {
  id: NEOX_MAINNET_CHAIN_ID, // Replace with your custom chain ID
  name: "Neo X", // Replace with your custom chain name
  network: "mainnet", // Replace with your network name if applicable
  nativeCurrency: {
    name: "GAS", // Replace with your currency name
    symbol: "GAS", // Replace with your currency symbol
    decimals: 18, // Replace with your currency decimals
  },
  rpcUrls: {
    default: {
      http: ["http://neoxseed1.ngd.network"],
    },
    public: {
      http: ["http://neoxseed1.ngd.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Custom Explorer",
      url: "https://xt1scan.ngd.network/",
    },
  },
  testnet: false, // Set to true if it's a testnet
};

export const NEOX_TESTNET_CHAIN_DETAIL = {
  id: NEOX_TESTNET_CHAIN_ID, // Replace with your custom chain ID
  name: "Neo X Testnet", // Replace with your custom chain name
  network: "testnet", // Replace with your network name if applicable
  nativeCurrency: {
    name: "GAS", // Replace with your currency name
    symbol: "GAS", // Replace with your currency symbol
    decimals: 18, // Replace with your currency decimals
  },
  rpcUrls: {
    default: {
      http: ["http://neoxseed1.ngd.network"],
    },
    public: {
      http: ["http://neoxseed1.ngd.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Custom Explorer",
      url: "https://xt1scan.ngd.network/",
    }, // Replace with your block explorer details
  },
  testnet: false, // Set to true if it's a testnet
};

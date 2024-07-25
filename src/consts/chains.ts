import {
  BASE_CHAIN,
  BASE_LOGO,
  BASE_MAINNET_CHAIN_ID,
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
  | typeof NEOX_CHAIN
  | typeof BASE_CHAIN;

export const LIST = [
  NEO_CHAIN,
  NEOX_CHAIN,
  ETH_CHAIN,
  BASE_CHAIN,
  POLYGON_CHAIN,
];

// Define your custom chain
export const NEOX_MAINNET_CHAIN_DETAIL: any = {
  id: NEOX_MAINNET_CHAIN_ID, // Replace with your custom chain ID
  name: "NeoX", // Replace with your custom chain name
  nativeCurrency: {
    name: "GAS", // Replace with your currency name
    symbol: "GAS", // Replace with your currency symbol
    decimals: 18, // Replace with your currency decimals
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet-1.rpc.banelabs.org"],
    },
    public: {
      http: ["https://mainnet-1.rpc.banelabs.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Neo x Explorer",
      url: "https://xexplorer.neo.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xD6010D102015fEa9cB3a9AbFBB51994c0Fd6E672",
      blockCreated: 7271,
    },
  },
};

export const NEOX_TESTNET_CHAIN_DETAIL = {
  id: NEOX_TESTNET_CHAIN_ID,
  name: "NeoX Testnet",
  nativeCurrency: {
    name: "GAS",
    symbol: "GAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://neoxseed1.ngd.network"],
    },
    public: {
      http: ["https://neoxseed1.ngd.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Neo x Testnet Explorer",
      url: "https://xt3scan.ngd.network",
    },
  },
  testnet: true, // Set to true if it's a testnet
};

export const CONFIGS = {
  [MAINNET]: {
    [NEO_CHAIN]: {
      label: "Neo",
      color: "primary",
      icon: NEO_LOGO,
      chainId: NEO_MAINNET_CHAIN_ID,
      rpc: "https://neoscan.io/api/main_net/v1",
    },
    [ETH_CHAIN]: {
      label: "Ethereum",
      color: "dark",
      icon: "/symbols/eth.png",
      chainId: ETH_MAINNET_CHAIN_ID,
      rpc: `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY}`,
    },
    [POLYGON_CHAIN]: {
      label: "Polygon",
      color: "info",
      icon: POLYGON_LOGO,
      chainId: POLYGON_MAINNET_CHAIN_ID,
      rpc: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY}`,
    },
    [NEOX_CHAIN]: {
      label: "NeoX",
      color: "danger",
      icon: NEOX_LOGO,
      chainId: NEOX_MAINNET_CHAIN_ID,
      rpc: NEOX_MAINNET_CHAIN_DETAIL.rpcUrls.default.http[0],
    },
    [BASE_CHAIN]: {
      label: "Base",
      color: "info",
      icon: BASE_LOGO,
      chainId: BASE_MAINNET_CHAIN_ID,
      rpc: "https://mainnet.base.org",
    },
  },
  [TESTNET]: {
    [NEO_CHAIN]: {
      label: "Neo Testnet",
      color: "primary",
      icon: NEO_LOGO,
      chainId: NEO_TESTNET_CHAIN_ID,
      rpc: "https://neoscan-testnet.io/api/test_net/v1",
    },
    [ETH_CHAIN]: {
      label: "Goerli",
      color: "dark",
      icon: "/symbols/eth.png",
      chainId: ETH_TESTNET_CHAIN_ID,
      rpc: `https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_POLYGON_TESTNET_API_KEY}`,
    },
    [POLYGON_CHAIN]: {
      label: "Polygon Mumbai",
      color: "info",
      icon: POLYGON_LOGO,
      chainId: POLYGON_TESTNET_CHAIN_ID,
      rpc: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_POLYGON_TESTNET_API_KEY}`,
    },
    [NEOX_CHAIN]: {
      label: "NeoX Testnet",
      color: "primary",
      icon: NEOX_LOGO,
      chainId: NEOX_TESTNET_CHAIN_ID,
      rpc: NEOX_TESTNET_CHAIN_DETAIL.rpcUrls.default.http[0],
    },
  },
};

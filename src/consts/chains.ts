import { Chain } from "viem";
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
  ETH_CHAIN,
  BASE_CHAIN,
  POLYGON_CHAIN,
  NEOX_CHAIN,
];

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
      label: "NeoX Testnet",
      color: "danger",
      icon: NEOX_LOGO,
      chainId: NEOX_MAINNET_CHAIN_ID,
      rpc: "https://neoxseed1.ngd.network",
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
      rpc: "https://neoxseed1.ngd.network",
    },
  },
};

// Define your custom chain
export const NEOX_MAINNET_CHAIN_DETAIL: Chain = {
  id: NEOX_MAINNET_CHAIN_ID, // Replace with your custom chain ID
  name: "NeoX", // Replace with your custom chain name
  nativeCurrency: {
    name: "GAS", // Replace with your currency name
    symbol: "GAS", // Replace with your currency symbol
    decimals: 18, // Replace with your currency decimals
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
      name: "Custom Explorer",
      url: "https://xt2scan.ngd.network/",
    },
  },
  // contracts: {
  //   multicall3: {
  //     address: "0xca11bde05977b3631167028862be2a173976ca11",
  //     blockCreated: 25770160,
  //   },
  // },
};

export const NEOX_TESTNET_CHAIN_DETAIL = {
  id: NEOX_TESTNET_CHAIN_ID, // Replace with your custom chain ID
  name: "NeoX Testnet", // Replace with your custom chain name
  network: "testnet", // Replace with your network name if applicable
  nativeCurrency: {
    name: "GAS", // Replace with your currency name
    symbol: "GAS", // Replace with your currency symbol
    decimals: 18, // Replace with your currency decimals
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
      name: "Custom Explorer",
      url: "https://xt2scan.ngd.network/",
    }, // Replace with your block explorer details
  },
  testnet: false, // Set to true if it's a testnet
  // contracts: {
  //   multicall3: {
  //     address: "0xca11bde05977b3631167028862be2a173976ca11",
  //     blockCreated: 25770160,
  //   },
  // },
};

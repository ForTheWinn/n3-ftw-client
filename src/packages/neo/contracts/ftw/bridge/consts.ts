import {
  CONFIGS,
  NEO_CHAIN,
  POLYGON_CHAIN
} from "../../../../../consts/chains";
import { MAINNET, TESTNET } from "../../../../../consts/global";
import { MAINNET_CONFIG, TESTNET_CONFIG } from "../../../consts";
import { INetworkType } from "../../../network";

export const BRIDGE_NEP_FEE = {
  [TESTNET]: 100_00000000,
  [MAINNET]: 100_00000000
};

export const BRIDGE_CHAINS = {
  [MAINNET]: {
    888: {
      type: NEO_CHAIN,
      name: "Neo",
      chainId: 888,
      chains: [137],
      icon: "/symbols/neo.svg",
      rpc: MAINNET_CONFIG.url
    },
    137: {
      type: POLYGON_CHAIN,
      name: "Polygon",
      chainId: 137,
      chains: [888],
      icon: "/symbols/matic.png",
      rpc: ""
    }
  },
  [TESTNET]: {
    889: {
      type: NEO_CHAIN,
      name: "Neo Testnet",
      chainId: 889,
      chains: [80001],
      icon: "/symbols/neo.svg",
      rpc: TESTNET_CONFIG.url
    },
    80001: {
      type: POLYGON_CHAIN,
      name: "Polygon Mumbai",
      chainId: 80001,
      chains: [889],
      icon: "/symbols/matic.png",
      rpc: ""
    }
  }
};

export const BRIDGE_CHAIN_LIST = (network: INetworkType) =>
  Object.keys(BRIDGE_CHAINS[network]).map((key) => {
    return BRIDGE_CHAINS[network][key];
  });

export const BRIDGE_SUPPORTED_TOKENS = {
  [MAINNET]: [],
  [TESTNET]: [
    {
      symbol: "BNEO",
      icon: "/symbols/bneo.jpeg",
      decimals: 8,
      addresses: {
        889: "0x85deac50febfd93988d3f391dea54e8289e43e9e",
        80001: "0x725BE5E1cDFCCb4e351C8CCbBA762cA4F0d8ee54"
      }
    },
    {
      symbol: "NEP",
      icon: "/symbols/nep.png",
      decimals: 8,
      addresses: {
        889: "0x6f50289324428858794b384b2d57dce49959b95f",
        80001: "0x5fD762EED8228f2dc83E129713888bcD0fDc2376"
      }
    }
  ]
};

export const BRIDGE_CONTRACTS = {
  [MAINNET]: {},
  [TESTNET]: {
    889: {
      80001: "0xf1865f752da8c67854b8643b396dd55ea785cc8f"
    },
    80001: {
      889: "0xE6Eea8610955eCD31edcdbB2DDCB2A937BDe419A"
    }
  }
};

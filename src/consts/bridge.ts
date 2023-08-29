import {
  BRIDGE,
  MAINNET,
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
import { POLYGON_CONTRACT_MAP } from "../packages/polygon/consts";

import * as polygonTestnetConsts from "../packages/polygon/consts/testnet";
import * as neoTestnetConsts from "../packages/neo/consts/testnet";
import { POLYGON_MAINNET_NEP_TOKEN_METADATA } from "../packages/polygon/consts/mainnet";
import { NEO_MAINNET_NEP_TOKEN_METADATA as NEO_NEP_DETAIL } from "../packages/neo/consts/mainnet";

import { MAINNET_CONFIG, TESTNET_CONFIG } from "../packages/neo/consts";
import { INetworkType } from "../packages/neo/network";
import { BRIDGE_SCRIPT_HASH } from "../packages/neo/contracts/ftw/bridge/consts";

export const BRIDGE_NEP_FEE = {
  [TESTNET]: 1_00000000,
  [MAINNET]: 100_00000000,
};

export const BRIDGE_NEP_FEE_FORMATTED = {
  [TESTNET]: 1,
  [MAINNET]: 100,
};

export const BRIDGE_CHAINS = {
  [MAINNET]: {
    [NEO_MAINNET_CHAIN_ID]: {
      type: NEO_CHAIN,
      name: "Neo",
      chainId: NEO_MAINNET_CHAIN_ID,
      chains: [POLYGON_MAINNET_CHAIN_ID],
      icon: NEO_LOGO,
      rpc: MAINNET_CONFIG.url,
    },
    [POLYGON_MAINNET_CHAIN_ID]: {
      type: POLYGON_CHAIN,
      name: "Polygon",
      chainId: POLYGON_MAINNET_CHAIN_ID,
      chains: [NEO_MAINNET_CHAIN_ID],
      icon: POLYGON_LOGO,
      rpc: "",
    },
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: {
      type: NEO_CHAIN,
      name: "Neo Testnet",
      chainId: NEO_TESTNET_CHAIN_ID,
      chains: [POLYGON_TESTNET_CHAIN_ID],
      icon: NEO_LOGO,
      rpc: TESTNET_CONFIG.url,
    },
    [POLYGON_TESTNET_CHAIN_ID]: {
      type: POLYGON_CHAIN,
      name: "Polygon Mumbai",
      chainId: POLYGON_TESTNET_CHAIN_ID,
      chains: [NEO_TESTNET_CHAIN_ID],
      icon: POLYGON_LOGO,
      rpc: "",
    },
  },
};

export const BRIDGE_CHAIN_LIST = (network: INetworkType) =>
  Object.keys(BRIDGE_CHAINS[network]).map((key) => {
    return BRIDGE_CHAINS[network][key];
  });

export const BRIDGE_SUPPORTED_TOKEN_LIST = {
  [MAINNET]: {
    [NEO_MAINNET_CHAIN_ID]: [
      {
        ...NEO_NEP_DETAIL,
        pairs: {
          [POLYGON_MAINNET_CHAIN_ID]: POLYGON_MAINNET_NEP_TOKEN_METADATA,
        },
      },
    ],
    [POLYGON_MAINNET_CHAIN_ID]: [
      {
        ...POLYGON_MAINNET_NEP_TOKEN_METADATA,
        pairs: {
          [NEO_MAINNET_CHAIN_ID]: NEO_NEP_DETAIL,
        },
      },
    ],
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: [
      {
        ...neoTestnetConsts.NEO_TESTNET_BNEO_METADATA,
        pairs: {
          [POLYGON_TESTNET_CHAIN_ID]:
            polygonTestnetConsts.POLYGON_TESTNET_FNEO_METADATA,
        },
      },
      {
        ...neoTestnetConsts.NEO_TESTNET_NEP_METADATA,
        pairs: {
          [POLYGON_TESTNET_CHAIN_ID]:
            polygonTestnetConsts.POLYGON_TESTNET_NEP_METADATA,
        },
      },
    ],
    [POLYGON_TESTNET_CHAIN_ID]: [
      {
        ...polygonTestnetConsts.POLYGON_TESTNET_FNEO_METADATA,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: neoTestnetConsts.NEO_TESTNET_BNEO_METADATA,
        },
      },
      {
        ...polygonTestnetConsts.POLYGON_TESTNET_NEP_METADATA,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: neoTestnetConsts.NEO_TESTNET_NEP_METADATA,
        },
      },
    ],
  },
};

export const BRIDGE_CONTRACTS = {
  [MAINNET]: {
    [NEO_MAINNET_CHAIN_ID]: {
      [POLYGON_MAINNET_CHAIN_ID]: BRIDGE_SCRIPT_HASH[MAINNET],
    },
    [POLYGON_MAINNET_CHAIN_ID]: {
      [NEO_MAINNET_CHAIN_ID]: POLYGON_CONTRACT_MAP[MAINNET][BRIDGE],
    },
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: {
      [POLYGON_TESTNET_CHAIN_ID]: BRIDGE_SCRIPT_HASH[TESTNET],
    },
    [POLYGON_TESTNET_CHAIN_ID]: {
      [NEO_TESTNET_CHAIN_ID]: POLYGON_CONTRACT_MAP[TESTNET][BRIDGE],
    },
  },
};

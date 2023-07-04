import { BRIDGE, MAINNET, NEO_CHAIN, POLYGON_CHAIN, TESTNET } from "./global";
import { CONTRACT_LIST } from "../packages/polygon/consts";

import * as polygonTestnetConsts from "../packages/polygon/consts/testnet";
import * as neoTestnetConsts from "../packages/neo/consts/testnet-token-list";

import { MAINNET_CONFIG, TESTNET_CONFIG } from "../packages/neo/consts";
// import {
//   BNEO_SCRIPT_HASH,
//   NEP_SCRIPT_HASH
// } from "../packages/neo/consts/neo-contracts";
import { INetworkType } from "../packages/neo/network";
import { BRIDGE_SCRIPT_HASH } from "../packages/neo/contracts/ftw/bridge/consts";

export const BRIDGE_NEP_FEE = {
  [TESTNET]: 100_00000000,
  [MAINNET]: 100_00000000,
};

export const BRIDGE_NEP_FEE_FORMATTED = {
  [TESTNET]: 100,
  [MAINNET]: 100,
};

export const BRIDGE_CHAINS = {
  [MAINNET]: {
    888: {
      type: NEO_CHAIN,
      name: "Neo",
      chainId: 888,
      chains: [137],
      icon: "/symbols/neo.svg",
      rpc: MAINNET_CONFIG.url,
    },
    137: {
      type: POLYGON_CHAIN,
      name: "Polygon",
      chainId: 137,
      chains: [888],
      icon: "/symbols/matic.png",
      rpc: "",
    },
  },
  [TESTNET]: {
    889: {
      type: NEO_CHAIN,
      name: "Neo Testnet",
      chainId: 889,
      chains: [80001],
      icon: "/symbols/neo.svg",
      rpc: TESTNET_CONFIG.url,
    },
    80001: {
      type: POLYGON_CHAIN,
      name: "Polygon Mumbai",
      chainId: 80001,
      chains: [889],
      icon: "/symbols/matic.png",
      rpc: "",
    },
  },
};

export const BRIDGE_CHAIN_LIST = (network: INetworkType) =>
  Object.keys(BRIDGE_CHAINS[network]).map((key) => {
    return BRIDGE_CHAINS[network][key];
  });

// export const BRIDGE_SUPPORTED_TOKENS = {
//   [MAINNET]: [],
//   [TESTNET]: [
//     {
//       symbol: "BNEO",
//       icon: "/symbols/bneo.jpeg",
//       decimals: 8,
//       addresses: {
//         889: BNEO_SCRIPT_HASH[TESTNET],
//         80001: FNEO_SCRIPT_HASHES[TESTNET]
//       }
//     },
//     {
//       symbol: "NEP",
//       icon: "/symbols/nep.png",
//       decimals: 8,
//       addresses: {
//         889: NEP_SCRIPT_HASH[TESTNET],
//         80001: NEP_SCRIPT_HASHES[TESTNET]
//       }
//     }
//   ]
// };

export const BRIDGE_SUPPORTED_TOKEN_LIST = {
  [MAINNET]: [],
  [TESTNET]: {
    889: [
      {
        ...neoTestnetConsts.BNEO_TESTNET_DETAIL,
        pairs: {
          80001: polygonTestnetConsts.FNEO_TESTNET_DETAIL,
        },
      },
      {
        ...neoTestnetConsts.NEP_TESTNET_DETAIL,
        pairs: {
          80001: polygonTestnetConsts.NEP_TESTNET_DETAIL,
        },
      },
    ],
    80001: [
      {
        ...polygonTestnetConsts.FNEO_TESTNET_DETAIL,
        pairs: {
          889: neoTestnetConsts.BNEO_TESTNET_DETAIL,
        },
      },
      {
        ...polygonTestnetConsts.NEP_TESTNET_DETAIL,
        pairs: {
          889: neoTestnetConsts.NEP_TESTNET_DETAIL,
        },
      },
    ],
  },
};

export const BRIDGE_CONTRACTS = {
  [MAINNET]: {},
  [TESTNET]: {
    889: {
      80001: BRIDGE_SCRIPT_HASH[TESTNET],
    },
    80001: {
      889: CONTRACT_LIST[TESTNET][BRIDGE],
    },
  },
};

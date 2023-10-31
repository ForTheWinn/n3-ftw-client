import {
  BRIDGE,
  ETHEREUM_LOGO,
  ETH_CHAIN,
  ETH_MAINNET_CHAIN_ID,
  ETH_TESTNET_CHAIN_ID,
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
import { POLYGON_CONTRACT_MAP } from "../packages/evm/polygon";

import { POLYGON_MAINNET_NEP_TOKEN_METADATA } from "../packages/evm/polygon/mainnet";
import { NEO_MAINNET_NEP_TOKEN_METADATA as NEO_NEP_DETAIL } from "../packages/neo/consts/mainnet";

import { MAINNET_CONFIG, TESTNET_CONFIG } from "../packages/neo/consts";
import { INetworkType } from "../packages/neo/network";
import { NEO_BRIDGE_SCRIPT_HASH } from "../packages/neo/contracts/ftw/bridge/consts";
import { ETHEREUM_CONTRACT_MAP } from "../packages/evm/ethereum";
import { ETHEREUM_MAINNET_NEP_TOKEN_METADATA } from "../packages/evm/ethereum/mainnet";
import {
  POLYGON_TESTNET_FNEO_METADATA,
  POLYGON_TESTNET_NEP_METADATA,
} from "../packages/evm/polygon/testnet";
import { ETHEREUM_TESTNET_NEP_METADATA } from "../packages/evm/ethereum/testnet";
import {
  NEO_TESTNET_BNEO_METADATA,
  NEO_TESTNET_NEP_METADATA,
} from "../packages/neo/consts/testnet";

export const BRIDGE_NEP_FEE = {
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: {
      [POLYGON_TESTNET_CHAIN_ID]: 1,
      [ETH_TESTNET_CHAIN_ID]: 0,
    },
    [POLYGON_TESTNET_CHAIN_ID]: {
      [NEO_TESTNET_CHAIN_ID]: 1,
    },
    [ETH_TESTNET_CHAIN_ID]: {
      [NEO_TESTNET_CHAIN_ID]: 0,
    },
  },
  [MAINNET]: {
    [NEO_MAINNET_CHAIN_ID]: {
      [POLYGON_MAINNET_CHAIN_ID]: 100_00000000,
      [ETH_MAINNET_CHAIN_ID]: 3000_00000000,
    },
    [POLYGON_MAINNET_CHAIN_ID]: {
      [NEO_MAINNET_CHAIN_ID]: 100_00000000,
    },
    [ETH_MAINNET_CHAIN_ID]: {
      [NEO_MAINNET_CHAIN_ID]: 1000_00000000,
    },
  },
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
      chains: [POLYGON_MAINNET_CHAIN_ID, ETH_MAINNET_CHAIN_ID],
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
    [ETH_MAINNET_CHAIN_ID]: {
      type: ETH_CHAIN,
      name: "Ethereum",
      chainId: ETH_MAINNET_CHAIN_ID,
      chains: [NEO_MAINNET_CHAIN_ID],
      icon: ETHEREUM_LOGO,
      rpc: "",
    },
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: {
      type: NEO_CHAIN,
      name: "Neo Testnet",
      chainId: NEO_TESTNET_CHAIN_ID,
      chains: [ETH_TESTNET_CHAIN_ID, POLYGON_TESTNET_CHAIN_ID],
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
    [ETH_TESTNET_CHAIN_ID]: {
      type: ETH_CHAIN,
      name: "Ethereum Goerli",
      chainId: ETH_TESTNET_CHAIN_ID,
      chains: [NEO_TESTNET_CHAIN_ID],
      icon: ETHEREUM_LOGO,
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
          [ETH_MAINNET_CHAIN_ID]: ETHEREUM_MAINNET_NEP_TOKEN_METADATA,
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
    [ETH_MAINNET_CHAIN_ID]: [
      {
        ...ETHEREUM_MAINNET_NEP_TOKEN_METADATA,
        pairs: {
          [NEO_MAINNET_CHAIN_ID]: NEO_NEP_DETAIL,
        },
      },
    ],
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: [
      {
        ...NEO_TESTNET_BNEO_METADATA,
        pairs: {
          [POLYGON_TESTNET_CHAIN_ID]: POLYGON_TESTNET_FNEO_METADATA,
        },
      },
      {
        ...NEO_TESTNET_NEP_METADATA,
        pairs: {
          [POLYGON_TESTNET_CHAIN_ID]: POLYGON_TESTNET_NEP_METADATA,
          [ETH_TESTNET_CHAIN_ID]: ETHEREUM_TESTNET_NEP_METADATA,
        },
      },
    ],
    [POLYGON_TESTNET_CHAIN_ID]: [
      {
        ...POLYGON_TESTNET_FNEO_METADATA,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: NEO_TESTNET_BNEO_METADATA,
        },
      },
      {
        ...POLYGON_TESTNET_NEP_METADATA,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: NEO_TESTNET_NEP_METADATA,
        },
      },
    ],
    [ETH_TESTNET_CHAIN_ID]: [
      {
        ...ETHEREUM_TESTNET_NEP_METADATA,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: NEO_TESTNET_NEP_METADATA,
        },
      },
    ],
  },
};

export const BRIDGE_CONTRACTS = {
  [MAINNET]: {
    [NEO_MAINNET_CHAIN_ID]: {
      [POLYGON_MAINNET_CHAIN_ID]:
        NEO_BRIDGE_SCRIPT_HASH[POLYGON_CHAIN][MAINNET],
      [ETH_MAINNET_CHAIN_ID]: NEO_BRIDGE_SCRIPT_HASH[ETH_CHAIN][MAINNET],
    },
    [POLYGON_MAINNET_CHAIN_ID]: {
      [NEO_MAINNET_CHAIN_ID]: POLYGON_CONTRACT_MAP[MAINNET][BRIDGE],
    },
    [ETH_MAINNET_CHAIN_ID]: {
      [NEO_MAINNET_CHAIN_ID]: ETHEREUM_CONTRACT_MAP[MAINNET][BRIDGE],
    },
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: {
      [POLYGON_TESTNET_CHAIN_ID]:
        NEO_BRIDGE_SCRIPT_HASH[POLYGON_CHAIN][TESTNET],
      [ETH_TESTNET_CHAIN_ID]: NEO_BRIDGE_SCRIPT_HASH[ETH_CHAIN][TESTNET],
    },
    [POLYGON_TESTNET_CHAIN_ID]: {
      [NEO_TESTNET_CHAIN_ID]: POLYGON_CONTRACT_MAP[TESTNET][BRIDGE],
    },
    [ETH_TESTNET_CHAIN_ID]: {
      [NEO_TESTNET_CHAIN_ID]: ETHEREUM_CONTRACT_MAP[TESTNET][BRIDGE],
    },
  },
};

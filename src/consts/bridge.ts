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
import {
  POLYGON_CONTRACTS,
  POLYGON_TESTNET_CONTRACTS,
} from "../packages/evm/polygon";

import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_NEP_CONTRACT_ADDRESS,
} from "../packages/neo/consts/tokens";

import { MAINNET_CONFIG, TESTNET_CONFIG } from "../packages/neo/consts";
import { NEO_BRIDGE_SCRIPT_HASH } from "../packages/neo/contracts/ftw/bridge/consts";
import {
  ETHEREUM_CONTRACTS,
  ETHEREUM_MAINNET_CONTRACTS,
  ETHEREUM_TESTNET_CONTRACTS,
} from "../packages/evm/ethereum";

import { getTokenByHash } from "../common/helpers";
import { POLYGON_MAINNET_CONTRACTS } from "../packages/evm/polygon";

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

const NEO_MAINNET_NEP = getTokenByHash(
  NEO_CHAIN,
  MAINNET,
  NEO_NEP_CONTRACT_ADDRESS[MAINNET]
);
const NEO_TESTNET_NEP = getTokenByHash(
  NEO_CHAIN,
  TESTNET,
  NEO_NEP_CONTRACT_ADDRESS[TESTNET]
);
const NEO_MAINNET_BNEO = getTokenByHash(
  NEO_CHAIN,
  MAINNET,
  NEO_BNEO_CONTRACT_ADDRESS[MAINNET]
);
const NEO_TESTNET_BNEO = getTokenByHash(
  NEO_CHAIN,
  TESTNET,
  NEO_BNEO_CONTRACT_ADDRESS[TESTNET]
);

const POLYGON_MAINNET_NEP = getTokenByHash(
  POLYGON_CHAIN,
  MAINNET,
  POLYGON_MAINNET_CONTRACTS.NEP
);
const POLYGON_MAINNET_FNEO = getTokenByHash(
  POLYGON_CHAIN,
  MAINNET,
  POLYGON_MAINNET_CONTRACTS.FNEO
);
const POLYGON_TESTNET_NEP = getTokenByHash(
  POLYGON_CHAIN,
  TESTNET,
  POLYGON_TESTNET_CONTRACTS.NEP
);
const POLYGON_TESTNET_FNEO = getTokenByHash(
  POLYGON_CHAIN,
  TESTNET,
  POLYGON_TESTNET_CONTRACTS.FNEO
);

const ETHEREUM_MAINNET_NEP = getTokenByHash(
  ETH_CHAIN,
  MAINNET,
  ETHEREUM_MAINNET_CONTRACTS.NEP
);
const ETHEREUM_MAINNET_FNEO = getTokenByHash(
  ETH_CHAIN,
  MAINNET,
  ETHEREUM_MAINNET_CONTRACTS.FNEO
);

const ETHEREUM_TESTNET_NEP= getTokenByHash(
  ETH_CHAIN,
  TESTNET,
  ETHEREUM_TESTNET_CONTRACTS.NEP
);

export const BRIDGE_SUPPORTED_TOKEN_LIST = {
  [MAINNET]: {
    [NEO_MAINNET_CHAIN_ID]: [
      {
        ...NEO_MAINNET_NEP,
        pairs: {
          [ETH_MAINNET_CHAIN_ID]: ETHEREUM_MAINNET_NEP,
          [POLYGON_MAINNET_CHAIN_ID]: POLYGON_MAINNET_NEP,
        },
      },
      {
        ...NEO_MAINNET_BNEO,
        pairs: {
          [ETH_MAINNET_CHAIN_ID]: ETHEREUM_MAINNET_FNEO,
          [POLYGON_MAINNET_CHAIN_ID]: POLYGON_MAINNET_FNEO,
        },
      },
    ],
    [POLYGON_MAINNET_CHAIN_ID]: [
      {
        ...POLYGON_MAINNET_NEP,
        pairs: {
          [NEO_MAINNET_CHAIN_ID]: NEO_MAINNET_NEP,
        },
      },
      {
        ...POLYGON_MAINNET_FNEO,
        pairs: {
          [NEO_MAINNET_CHAIN_ID]: NEO_MAINNET_BNEO,
        },
      },
    ],
    [ETH_MAINNET_CHAIN_ID]: [
      {
        ...ETHEREUM_MAINNET_NEP,
        pairs: {
          [NEO_MAINNET_CHAIN_ID]: NEO_MAINNET_NEP,
        },
      },
      {
        ...ETHEREUM_MAINNET_FNEO,
        pairs: {
          [NEO_MAINNET_CHAIN_ID]: NEO_MAINNET_BNEO,
        },
      },
    ],
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: [
      {
        ...NEO_TESTNET_BNEO,
        pairs: {
          [POLYGON_TESTNET_CHAIN_ID]: POLYGON_TESTNET_FNEO,
        },
      },
      {
        ...NEO_TESTNET_NEP,
        pairs: {
          [POLYGON_TESTNET_CHAIN_ID]: POLYGON_TESTNET_NEP,
          [ETH_TESTNET_CHAIN_ID]: ETHEREUM_TESTNET_NEP,
        },
      },
    ],
    [POLYGON_TESTNET_CHAIN_ID]: [
      {
        ...POLYGON_TESTNET_FNEO,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: NEO_TESTNET_BNEO,
        },
      },
      {
        ...POLYGON_TESTNET_NEP,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: NEO_TESTNET_NEP,
        },
      },
    ],
    [ETH_TESTNET_CHAIN_ID]: [
      {
        ...ETHEREUM_TESTNET_NEP,
        pairs: {
          [NEO_TESTNET_CHAIN_ID]: NEO_TESTNET_NEP,
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
      [NEO_MAINNET_CHAIN_ID]: POLYGON_CONTRACTS[MAINNET][BRIDGE],
    },
    [ETH_MAINNET_CHAIN_ID]: {
      [NEO_MAINNET_CHAIN_ID]: ETHEREUM_CONTRACTS[MAINNET][BRIDGE],
    },
  },
  [TESTNET]: {
    [NEO_TESTNET_CHAIN_ID]: {
      [POLYGON_TESTNET_CHAIN_ID]:
        NEO_BRIDGE_SCRIPT_HASH[POLYGON_CHAIN][TESTNET],
      [ETH_TESTNET_CHAIN_ID]: NEO_BRIDGE_SCRIPT_HASH[ETH_CHAIN][TESTNET],
    },
    [POLYGON_TESTNET_CHAIN_ID]: {
      [NEO_TESTNET_CHAIN_ID]: POLYGON_CONTRACTS[TESTNET][BRIDGE],
    },
    [ETH_TESTNET_CHAIN_ID]: {
      [NEO_TESTNET_CHAIN_ID]: ETHEREUM_CONTRACTS[TESTNET][BRIDGE],
    },
  },
};

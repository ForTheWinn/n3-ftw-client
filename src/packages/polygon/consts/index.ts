import {
  POLYGON_TESTNET_CONTRACTS,
  POLYGON_TESTNET_SWAP_TOKEN_MAP,
  POLYGON_TESTNET_TOKEN_METADATA_MAP,
} from "./testnet";
import {
  POLYGON_MAINNET_CONTRACTS,
  POLYGON_MAINNET_SWAP_TOKEN_MAP,
  POLYGON_MAINNET_TOKEN_METADATA_MAP,
} from "./mainnet";

import {
  MAINNET,
  TESTNET,
  SWAP,
  FARM,
  BRIDGE,
  SMITH,
} from "../../../consts/global";

export const POLYGON_TOKENS_METADATA_MAP = {
  [MAINNET]: POLYGON_MAINNET_TOKEN_METADATA_MAP,
  [TESTNET]: POLYGON_TESTNET_TOKEN_METADATA_MAP,
};

export const POLYGON_CONTRACT_MAP = {
  [MAINNET]: {
    [SWAP]: POLYGON_MAINNET_CONTRACTS.SWAP,
    [FARM]: POLYGON_MAINNET_CONTRACTS.FARM,
    [BRIDGE]: POLYGON_MAINNET_CONTRACTS.BRIDGE,
    [SMITH]: POLYGON_MAINNET_CONTRACTS.SMITH,
  },
  [TESTNET]: {
    [SWAP]: POLYGON_TESTNET_CONTRACTS.SWAP,
    [FARM]: POLYGON_TESTNET_CONTRACTS.FARM,
    [BRIDGE]: POLYGON_TESTNET_CONTRACTS.BRIDGE,
    [SMITH]: POLYGON_TESTNET_CONTRACTS.SMITH,
  },
};

export const POLYGON_SWAP_TOKENS_MAP = {
  [MAINNET]: POLYGON_MAINNET_SWAP_TOKEN_MAP,
  [TESTNET]: POLYGON_TESTNET_SWAP_TOKEN_MAP,
};

export const POLYGON_MAINNET_FNEO_CONTRACT_ADDRESSES = {
  [MAINNET]: POLYGON_MAINNET_CONTRACTS.FNEO,
  [TESTNET]: POLYGON_TESTNET_CONTRACTS.FNEO,
};

export const POLYGON_NEP_CONTRACT_ADDRESSES = {
  [MAINNET]: POLYGON_MAINNET_CONTRACTS.NEP,
  [TESTNET]: POLYGON_TESTNET_CONTRACTS.NEP,
};

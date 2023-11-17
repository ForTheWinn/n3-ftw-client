import {
  ETHEREUM_TESTNET_CONTRACTS,
  ETHEREUM_TESTNET_SWAP_TOKEN_MAP,
  ETHEREUM_TESTNET_TOKEN_METADATA_MAP,
} from "./testnet";
import {
  ETHEREUM_MAINNET_CONTRACTS,
  ETHEREUM_MAINNET_SWAP_TOKEN_MAP,
  ETHEREUM_MAINNET_TOKEN_METADATA_MAP,
} from "./mainnet";

import {
  MAINNET,
  TESTNET,
  SWAP,
  FARM,
  BRIDGE,
  SMITH,
} from "../../../consts/global";

export const ETHEREUM_TOKENS_METADATA_MAP = {
  [MAINNET]: ETHEREUM_MAINNET_TOKEN_METADATA_MAP,
  [TESTNET]: ETHEREUM_TESTNET_TOKEN_METADATA_MAP,
};

export const ETHEREUM_CONTRACT_MAP = {
  [MAINNET]: {
    [SWAP]: ETHEREUM_MAINNET_CONTRACTS.SWAP,
    [FARM]: ETHEREUM_MAINNET_CONTRACTS.FARM,
    [BRIDGE]: ETHEREUM_MAINNET_CONTRACTS.BRIDGE,
    [SMITH]: ETHEREUM_MAINNET_CONTRACTS.SMITH,
  },
  [TESTNET]: {
    [SWAP]: ETHEREUM_TESTNET_CONTRACTS.SWAP,
    [FARM]: ETHEREUM_TESTNET_CONTRACTS.FARM,
    [BRIDGE]: ETHEREUM_TESTNET_CONTRACTS.BRIDGE,
    [SMITH]: ETHEREUM_TESTNET_CONTRACTS.SMITH,
  },
};

export const ETHEREUM_SWAP_TOKENS_MAP = {
  [MAINNET]: ETHEREUM_MAINNET_SWAP_TOKEN_MAP,
  [TESTNET]: ETHEREUM_TESTNET_SWAP_TOKEN_MAP,
};

export const ETHEREUM_MAINNET_FNEO_CONTRACT_ADDRESSES = {
  [MAINNET]: ETHEREUM_MAINNET_CONTRACTS.FNEO,
  [TESTNET]: ETHEREUM_TESTNET_CONTRACTS.FNEO,
};

export const ETHEREUM_NEP_CONTRACT_ADDRESSES = {
  [MAINNET]: ETHEREUM_MAINNET_CONTRACTS.NEP,
  [TESTNET]: ETHEREUM_TESTNET_CONTRACTS.NEP,
};

export const ETH_FNEO = {
  name: "Ethereum ftwNEO",
  address: ETHEREUM_MAINNET_FNEO_CONTRACT_ADDRESSES,
};

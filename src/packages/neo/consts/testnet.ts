import { TESTNET } from "../../../consts/global";

import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_GAS_CONTRACT_ADDRESS,
  NEO_NEP_CONTRACT_ADDRESS,
} from "./tokens";

export const NEO_TESTNET_BNEO_METADATA = {
  hash: NEO_BNEO_CONTRACT_ADDRESS[TESTNET],
  symbol: "bNEO",
  icon: "/symbols/bneo.jpeg",
  decimals: 8,
};

export const NEO_TESTNET_GAS_METADATA = {
  hash: NEO_GAS_CONTRACT_ADDRESS,
  symbol: "GAS",
  icon: "/symbols/gas.svg",
  decimals: 8,
};

export const NEO_TESTNET_NEP_METADATA = {
  hash: NEO_NEP_CONTRACT_ADDRESS[TESTNET],
  symbol: "NEP",
  icon: "/symbols/nep.png",
  decimals: 8,
};

export const TESTNET_TOKEN_LIST = {
  [NEO_BNEO_CONTRACT_ADDRESS[TESTNET]]: NEO_TESTNET_BNEO_METADATA,
  [NEO_GAS_CONTRACT_ADDRESS]: NEO_TESTNET_GAS_METADATA,
  [NEO_NEP_CONTRACT_ADDRESS[TESTNET]]: NEO_TESTNET_NEP_METADATA,
};

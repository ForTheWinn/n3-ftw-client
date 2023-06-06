import { TESTNET } from "../../../consts/global";

import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEP_SCRIPT_HASH
} from "./neo-contracts";

export const BNEO_TESTNET_DETAIL = {
  hash: BNEO_SCRIPT_HASH[TESTNET],
  symbol: "bNEO",
  icon: "/symbols/bneo.jpeg",
  decimals: 8
};

export const GAS_TESTNET_DETAIL = {
  hash: GAS_SCRIPT_HASH,
  symbol: "GAS",
  icon: "/symbols/gas.svg",
  decimals: 8
};

export const NEP_TESTNET_DETAIL = {
  hash: NEP_SCRIPT_HASH[TESTNET],
  symbol: "NEP",
  icon: "/symbols/nep.png",
  decimals: 8
};

export const TESTNET_TOKEN_LIST = {
  [BNEO_SCRIPT_HASH[TESTNET]]: BNEO_TESTNET_DETAIL,
  [GAS_SCRIPT_HASH]: GAS_TESTNET_DETAIL,
  [NEP_SCRIPT_HASH[TESTNET]]: NEP_TESTNET_DETAIL
};

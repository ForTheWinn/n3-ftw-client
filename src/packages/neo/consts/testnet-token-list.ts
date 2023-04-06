import { TESTNET } from "../../../consts/global";

import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEP_SCRIPT_HASH
} from "./neo-contracts";


export const TESTNET_TOKEN_LIST = {
  [BNEO_SCRIPT_HASH[TESTNET]]: {
    hash: BNEO_SCRIPT_HASH[TESTNET],
    symbol: "bNEO",
    icon: "/symbols/bneo.jpeg",
    decimals: 8
  },
  [GAS_SCRIPT_HASH]: {
    hash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 8
  },
  [NEP_SCRIPT_HASH[TESTNET]]: {
    hash: NEP_SCRIPT_HASH[TESTNET],
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8
  }
};

import { TOKEN_CATEGORY_GENERAL } from ".";
import { TESTNET } from "../../../consts/global";

import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
  NEP_SCRIPT_HASH
} from "./neo-contracts";


export const TESTNET_TOKEN_LIST = {
  [BNEO_SCRIPT_HASH[TESTNET]]: {
    category: TOKEN_CATEGORY_GENERAL,
    hash: BNEO_SCRIPT_HASH[TESTNET],
    symbol: "bNEO",
    icon: "/symbols/bneo.jpeg",
    decimals: 8
  },
  [NEO_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_GENERAL,
    hash: NEO_SCRIPT_HASH,
    symbol: "NEO",
    icon: "/symbols/neo.svg",
    decimals: 0
  },
  [GAS_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_GENERAL,
    hash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 8
  },
  [NEP_SCRIPT_HASH[TESTNET]]: {
    category: TOKEN_CATEGORY_GENERAL,
    hash: NEP_SCRIPT_HASH[TESTNET],
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8
  }
};

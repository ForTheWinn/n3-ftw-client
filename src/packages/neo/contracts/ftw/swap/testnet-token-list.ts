import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  HOOD_SCRIPT_HASH,
	NEO_SCRIPT_HASH,
  NEP_SCRIPT_HASH,
} from "../../../consts/nep17-list";
import {
  TESTNET,
  TOKEN_CATEGORY_GENERAL,
  UNKNOWN_TOKEN_IMAGE,
} from "../../../consts";
export const TESTNET_TOKEN_LIST = {
  [BNEO_SCRIPT_HASH[TESTNET]]: {
    category: TOKEN_CATEGORY_GENERAL,
    contractHash: BNEO_SCRIPT_HASH[TESTNET],
    symbol: "bNEO",
    logo: "/symbols/bneo.jpeg",
    decimals: 8,
  },
	[NEO_SCRIPT_HASH]: {
		category: TOKEN_CATEGORY_GENERAL,
		contractHash: NEO_SCRIPT_HASH,
		symbol: "NEO",
		logo: "/symbols/neo.svg",
		decimals: 0,
	},
  [GAS_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_GENERAL,
    contractHash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    logo: "/symbols/gas.svg",
    decimals: 8,
  },
  [NEP_SCRIPT_HASH[TESTNET]]: {
    category: TOKEN_CATEGORY_GENERAL,
    contractHash: NEP_SCRIPT_HASH[TESTNET],
    symbol: "NEP",
    logo: "/symbols/nep.png",
    decimals: 8,
  },
  [HOOD_SCRIPT_HASH]: {
    contractHash: HOOD_SCRIPT_HASH,
    symbol: "HOOD",
    logo: UNKNOWN_TOKEN_IMAGE,
    decimals: 8,
  },
};

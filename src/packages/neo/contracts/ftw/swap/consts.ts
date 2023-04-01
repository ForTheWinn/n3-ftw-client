import {
  TOKEN_CATEGORY_GENERAL,
  TOKEN_CATEGORY_METAVERSE,
  TOKEN_CATEGORY_STARTUPS
} from "../../../consts";


import { GLOBAL } from "../../../../../consts";

const { TESTNET, MAINNET } = GLOBAL;

export const SWAP_FEE = 0.25;

export const DEFAULT_SLIPPAGE = 3;

export const PRICE_IMPACT_LIMIT = 100;

export const SWAP_SCRIPT_HASH = {
  [TESTNET]: "0xecb9465013477215e25aaf8e87ed02141ebe256e",
  [MAINNET]: "0x997ced5777a3f66485d66828bda3864b8c8bdf95"
};


export const SWAP_ASSET_CATEGORY = [
  TOKEN_CATEGORY_GENERAL,
  TOKEN_CATEGORY_METAVERSE,
  TOKEN_CATEGORY_STARTUPS
];

import {
  MAINNET,
  PRIVATENET,
  TESTNET,
  TOKEN_CATEGORY_GENERAL,
  TOKEN_CATEGORY_METAVERSE,
  TOKEN_CATEGORY_STARTUPS
} from "../../../consts";

import { INetworkType } from "../../../network";
import { MAINNET_TOKEN_LIST } from "../../../consts/mainnet-token-list";
import { TESTNET_TOKEN_LIST } from "../../../consts/testnet-token-list";

export const SWAP_FEE = 0.25;

export const DEFAULT_SLIPPAGE = 3;

export const PRICE_IMPACT_LIMIT = 100;

// address: NZaRfXQyyVam8pdpHU5GUZax3iv5mKTT2q
export const SWAP_SCRIPT_HASH = {
  [PRIVATENET]: "",
  [TESTNET]: "ecb9465013477215e25aaf8e87ed02141ebe256e",
  [MAINNET]: "997ced5777a3f66485d66828bda3864b8c8bdf95"
};

export const ASSET_LIST = {
  [TESTNET]: TESTNET_TOKEN_LIST,
  [MAINNET]: MAINNET_TOKEN_LIST
};

export const SWAP_ASSET_LIST = (network: INetworkType) => {
  const keys = Object.keys(ASSET_LIST[network]);
  return keys.map((key) => {
    return ASSET_LIST[network][key];
  });
};

export const SWAP_ASSET_CATEGORY = [
  TOKEN_CATEGORY_GENERAL,
  TOKEN_CATEGORY_METAVERSE,
  TOKEN_CATEGORY_STARTUPS
];

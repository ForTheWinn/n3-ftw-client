import * as testnet from "./testnet";
import * as mainnet from "./mainnet";

import {  MAINNET, TESTNET, SWAP, FARM } from "../../../consts/global";

export const TOKEN_LIST = {
  [MAINNET]: testnet.TOKEN_LIST,
  [TESTNET]: testnet.TOKEN_LIST
};

export const CONTRACT_LIST = {
  [MAINNET]: {
    [SWAP]: testnet.SWAP_CONTRACT_HASH,
    [FARM]: testnet.FARM_CONTRACT_HASH
  },
  [TESTNET]: {
    [SWAP]: testnet.SWAP_CONTRACT_HASH,
    [FARM]: testnet.FARM_CONTRACT_HASH
  }
};

export const SWAP_TOKEN_LIST = {
  [MAINNET]: Object.keys(TOKEN_LIST[MAINNET]).map((key) => {
    return TOKEN_LIST[MAINNET][key];
  }),
  [TESTNET]: Object.keys(TOKEN_LIST[TESTNET]).map((key) => {
    return TOKEN_LIST[TESTNET][key];
  }),
};

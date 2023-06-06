import * as testnet from "./testnet";
import * as mainnet from "./mainnet";

import { MAINNET, TESTNET, SWAP, FARM, BRIDGE } from "../../../consts/global";

export const TOKEN_LIST = {
  [MAINNET]: mainnet.TOKEN_LIST,
  [TESTNET]: testnet.TOKEN_LIST
};

export const CONTRACT_LIST = {
  [MAINNET]: {
    [SWAP]: mainnet.SWAP_CONTRACT_HASH,
    [FARM]: mainnet.FARM_CONTRACT_HASH,
    [BRIDGE]: mainnet.BRIDGE_CONTRACT_HASH
  },
  [TESTNET]: {
    [SWAP]: testnet.SWAP_CONTRACT_HASH,
    [FARM]: testnet.FARM_CONTRACT_HASH,
    [BRIDGE]: testnet.BRIDGE_CONTRACT_HASH
  }
};

export const SWAP_TOKEN_LIST = {
  [MAINNET]: Object.keys(TOKEN_LIST[MAINNET]).map((key) => {
    return TOKEN_LIST[MAINNET][key];
  }),
  [TESTNET]: Object.keys(TOKEN_LIST[TESTNET]).map((key) => {
    return TOKEN_LIST[TESTNET][key];
  })
};

export const FNEO_SCRIPT_HASHES = {
  [MAINNET]: mainnet.FNEO_CONTRACT_HASH,
  [TESTNET]: testnet.FNEO_CONTRACT_HASH
};

export const NEP_SCRIPT_HASHES = {
  [MAINNET]: mainnet.NEP_CONTRACT_HASH,
  [TESTNET]: testnet.NEP_CONTRACT_HASH
};

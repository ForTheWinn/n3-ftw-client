import {
  TOKEN_LIST as POLYGON_TOKEN_LIST,
  SWAP_TOKEN_LIST as POLYGON_SWAP_TOKEN_LIST
} from "../packages/polygon/consts";
import { MAINNET, NEO_CHAIN, POLYGON_CHAIN, TESTNET } from "./global";
import { MAINNET_TOKEN_LIST } from "../packages/neo/consts/mainnet-token-list";
import { TESTNET_TOKEN_LIST } from "../packages/neo/consts/testnet-token-list";

export const TOKEN_LIST = {
  [NEO_CHAIN]: {
    [MAINNET]: MAINNET_TOKEN_LIST,
    [TESTNET]: TESTNET_TOKEN_LIST
  },
  [POLYGON_CHAIN]: POLYGON_TOKEN_LIST
};

export const SWAP_TOKEN_LIST = {
  [NEO_CHAIN]: {
    [MAINNET]: Object.keys(MAINNET_TOKEN_LIST).map((key) => {
      return MAINNET_TOKEN_LIST[key];
    }),
    [TESTNET]: Object.keys(TESTNET_TOKEN_LIST).map((key) => {
      return TESTNET_TOKEN_LIST[key];
    })
  },
  [POLYGON_CHAIN]: POLYGON_SWAP_TOKEN_LIST
};

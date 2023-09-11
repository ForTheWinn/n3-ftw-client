import {
  POLYGON_TOKENS_METADATA_MAP,
  POLYGON_SWAP_TOKENS_MAP,
} from "../packages/polygon/consts";
import { ETH_CHAIN, MAINNET, NEO_CHAIN, POLYGON_CHAIN, TESTNET } from "./global";
import { NEO_MAINNET_TOKENS_METADATA_MAP } from "../packages/neo/consts/mainnet";
import { TESTNET_TOKEN_LIST } from "../packages/neo/consts/testnet";
import { ETH_SWAP_TOKENS_MAP } from "../packages/ethereum/consts";

export const TOKEN_LIST = {
  [NEO_CHAIN]: {
    [MAINNET]: NEO_MAINNET_TOKENS_METADATA_MAP,
    [TESTNET]: TESTNET_TOKEN_LIST,
  },
  [POLYGON_CHAIN]: POLYGON_TOKENS_METADATA_MAP,
};

export const SWAP_TOKEN_LIST = {
  [NEO_CHAIN]: {
    [MAINNET]: Object.keys(NEO_MAINNET_TOKENS_METADATA_MAP).map((key) => {
      return NEO_MAINNET_TOKENS_METADATA_MAP[key];
    }),
    [TESTNET]: Object.keys(TESTNET_TOKEN_LIST).map((key) => {
      return TESTNET_TOKEN_LIST[key];
    }),
  },
  [POLYGON_CHAIN]: POLYGON_SWAP_TOKENS_MAP,
  [ETH_CHAIN]: ETH_SWAP_TOKENS_MAP
};

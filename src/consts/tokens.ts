import { ETH_CHAIN, NEOX_CHAIN, NEO_CHAIN, POLYGON_CHAIN } from "./global";
import { ETHEREUM_SWAP_TOKENS_MAP } from "../packages/evm/ethereum";
import { POLYGON_SWAP_TOKENS_MAP } from "../packages/evm/polygon";
import { EVM_TOKEN_LIST } from "../packages/evm";
import { NEOX_SWAP_TOKENS_MAP } from "../packages/evm/neox";
import { NEO_SWAP_TOKENS, NEO_TOKENS } from "../packages/neo/consts";

export const TOKEN_LIST = {
  [NEO_CHAIN]: NEO_TOKENS,
  ...EVM_TOKEN_LIST,
};

/* Swap whitelisted tokens */
export const SWAP_TOKEN_LIST = {
  [NEO_CHAIN]: NEO_SWAP_TOKENS,
  [POLYGON_CHAIN]: POLYGON_SWAP_TOKENS_MAP,
  [ETH_CHAIN]: ETHEREUM_SWAP_TOKENS_MAP,
  [NEOX_CHAIN]: NEOX_SWAP_TOKENS_MAP,
};

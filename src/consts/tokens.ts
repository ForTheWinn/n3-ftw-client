import { NEO_CHAIN, POLYGON_CHAIN } from "../packages/chains/consts";
import { MAINNET_TOKEN_LIST } from "../packages/neo/consts/mainnet-token-list";
import { POLYGON_TOKEN_LIST } from "../packages/polygon";

export const TOKEN_LIST = {
  [NEO_CHAIN]: MAINNET_TOKEN_LIST,
  [POLYGON_CHAIN]: POLYGON_TOKEN_LIST
};

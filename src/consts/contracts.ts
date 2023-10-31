import { POLYGON_CONTRACT_MAP as POLYGON_CONTRACT_LIST } from "../packages/evm/polygon";
import { ETHEREUM_CONTRACT_MAP as ETHEREUM_CONTRACT_LIST } from "../packages/evm/ethereum";
import { CONTRACT_LIST as NEO_CONTRACT_LIST } from "../packages/neo/consts/contracts";
import { NEO_NEP_CONTRACT_ADDRESS } from "../packages/neo/consts/neo-contracts";
import { POLYGON_NEP_CONTRACT_ADDRESSES } from "../packages/evm/polygon";
import { ETH_CHAIN, NEO_CHAIN, POLYGON_CHAIN } from "./global";
import { ETHEREUM_NEP_CONTRACT_ADDRESSES } from "../packages/evm/ethereum";

export const CONTRACT_MAP = {
  [NEO_CHAIN]: NEO_CONTRACT_LIST,
  [POLYGON_CHAIN]: POLYGON_CONTRACT_LIST,
  [ETH_CHAIN]: ETHEREUM_CONTRACT_LIST,
};

export const GLOBAL_NEP_CONTRACT_ADDRESS = {
  [NEO_CHAIN]: NEO_NEP_CONTRACT_ADDRESS,
  [POLYGON_CHAIN]: POLYGON_NEP_CONTRACT_ADDRESSES,
  [ETH_CHAIN]: ETHEREUM_NEP_CONTRACT_ADDRESSES,
};

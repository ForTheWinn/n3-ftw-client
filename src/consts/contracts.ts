import { POLYGON_CONTRACTS as POLYGON_CONTRACT_LIST } from "../packages/evm/polygon";
import { ETHEREUM_CONTRACTS as ETHEREUM_CONTRACT_LIST } from "../packages/evm/ethereum";
import { CONTRACT_LIST as NEO_CONTRACT_LIST } from "../packages/neo/consts";
import { NEO_NEP_CONTRACT_ADDRESS } from "../packages/neo/consts/tokens";
import { POLYGON_NEP } from "../packages/evm/polygon";
import { BASE_CHAIN, ETH_CHAIN, NEOX_CHAIN, NEO_CHAIN, POLYGON_CHAIN } from "./global";
import { ETHEREUM_NEP_CONTRACT_ADDRESSES } from "../packages/evm/ethereum";
import { NEOX_CONTRACTS, NEOX_NEP_ADDRESSES } from "../packages/evm/neox";
import { BASE_CONTRACTS } from "../packages/evm/base";

export const CONTRACT_MAP = {
  [NEO_CHAIN]: NEO_CONTRACT_LIST,
  [POLYGON_CHAIN]: POLYGON_CONTRACT_LIST,
  [ETH_CHAIN]: ETHEREUM_CONTRACT_LIST,
  [NEOX_CHAIN]: NEOX_CONTRACTS,
  [BASE_CHAIN]: BASE_CONTRACTS,
};

export const NEP_ADDRESSES = {
  [NEO_CHAIN]: NEO_NEP_CONTRACT_ADDRESS,
  [POLYGON_CHAIN]: POLYGON_NEP,
  [ETH_CHAIN]: ETHEREUM_NEP_CONTRACT_ADDRESSES,
  [NEOX_CHAIN]: NEOX_NEP_ADDRESSES,
  [BASE_CHAIN]: NEOX_NEP_ADDRESSES,
};

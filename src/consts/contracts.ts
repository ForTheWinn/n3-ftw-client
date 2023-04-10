import { NEO_CHAIN, POLYGON_CHAIN } from "./chains";
import { CONSTS as POLYGON_CONSTS } from "../packages/polygon";
import { CONTRACT_LIST as NEO_CONTRACT_LIST } from "../packages/neo/consts/contracts";
import { NEP_SCRIPT_HASH } from "../packages/neo/consts/neo-contracts";
import { NEP_SCRIPT_HASHES } from "../packages/polygon/consts";

export const CONTRACT_LIST = {
  [NEO_CHAIN]: NEO_CONTRACT_LIST,
  [POLYGON_CHAIN]: POLYGON_CONSTS.CONTRACT_LIST
};

export const NEP_CONTRACT_HASH = {
  [NEO_CHAIN]: NEP_SCRIPT_HASH,
  [POLYGON_CHAIN]: NEP_SCRIPT_HASHES
};

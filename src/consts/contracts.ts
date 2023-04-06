import { NEO_CHAIN, POLYGON_CHAIN } from "./chains";
import { CONSTS as POLYGON_CONSTS } from "../packages/polygon";
import { CONTRACT_LIST as NEO_CONTRACT_LIST } from "../packages/neo/consts/contracts";

export const CONTRACT_LIST = {
  [NEO_CHAIN]: NEO_CONTRACT_LIST,
  [POLYGON_CHAIN]: POLYGON_CONSTS.CONTRACT_LIST
};

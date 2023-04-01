import { NEO_CHAIN, POLYGON_CHAIN } from "./chains";
import { CONSTS as POLYGON_CONSTS } from "../packages/polygon";
import { CONSTS as NEO_CONSTS } from "../packages/neo";

export const CONTRACT_LIST = {
  // [NEO_CHAIN]: NEO_CONSTS.CONTRACT_LIST,
  [POLYGON_CHAIN]: POLYGON_CONSTS.CONTRACT_LIST
};

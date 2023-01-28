import { NEO_CHAIN, POLYGON_CHAIN } from "../packages/chains/consts";
import { MENU } from "./pageRoutes";
import { polygonNav } from "./polygonRoutes";

export const navRoutes = {
  [NEO_CHAIN]: MENU,
  [POLYGON_CHAIN]: polygonNav,
};
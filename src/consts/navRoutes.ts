import { NEO_CHAIN, POLYGON_CHAIN } from "./chains";
import { MENU } from "./pageRoutes";
import { polygonNav } from "./polygonRoutes";

export const navRoutes = {
  [NEO_CHAIN]: MENU,
  [POLYGON_CHAIN]: polygonNav
};

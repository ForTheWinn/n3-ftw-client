import { MAINNET, TESTNET } from "../packages/neo/consts";

/* 
  Swap
*/
export const POLYGON_SWAP_PATH = "/polygon/swap";
export const POLYGON_SWAP_POOL_PATH = "/polygon/swap/pools";
export const POLYGON_SWAP_PATH_HISTORY = "/polygon/swap/history";
export const POLYGON_SWAP_PATH_LP_LIST = "/polygon/swap/providers";
export const POLYGON_SWAP_PATH_LIQUIDITY_ADD = "/polygon/swap/liquidity/add";
export const POLYGON_SWAP_PATH_LIQUIDITY_REMOVE =
  "/polygon/swap/liquidity/remove";

/* 
  Farm
*/
export const POLYGON_FARM_PATH = "/polygon/farm";

export const POLYGON_SWAP_ROUTE = {
  label: "Swap",
  path: POLYGON_SWAP_PATH,
  network: [TESTNET, MAINNET],
  category: [],
};

export const POLYGON_FARM_ROUTE = {
  label: "Farm",
  path: POLYGON_FARM_PATH,
  network: [TESTNET, MAINNET],
  category: [],
};

export const polygonNav = [POLYGON_SWAP_ROUTE, POLYGON_FARM_ROUTE];

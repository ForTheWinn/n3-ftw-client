import { MAINNET, TESTNET } from "./global";
import { FARM_V2_PATH, SWAP_PATH } from "./neoRoutes";

const SWAP_ROUTE = {
  label: "Swap",
  path: SWAP_PATH,
  network: [TESTNET, MAINNET],
  category: []
};

const FARM_ROUTE = {
  label: "Farm",
  path: FARM_V2_PATH,
  network: [TESTNET, MAINNET],
  category: []
};

export const ROUTES = [SWAP_ROUTE, FARM_ROUTE];

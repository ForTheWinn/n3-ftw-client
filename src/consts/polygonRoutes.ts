import { MAINNET, TESTNET } from "./global";

export const SWAP_PATH = "/polygon/swap";
export const FARM_PATH = "/polygon/farm";

const SWAP_ROUTE = {
  label: "Swap",
  path: SWAP_PATH,
  network: [TESTNET, MAINNET],
  category: []
};

const FARM_ROUTE = {
  label: "Farm",
  path: FARM_PATH,
  network: [TESTNET, MAINNET],
  category: []
};

export const ROUTES = [SWAP_ROUTE, FARM_ROUTE];

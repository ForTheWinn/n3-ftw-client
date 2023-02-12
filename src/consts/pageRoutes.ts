import { MAINNET, PRIVATENET, TESTNET } from "../packages/neo/consts";

/* 
  Global
*/
export const HOME_PATH = "/";
export const BRAND_KIT_PATH = "/brand-kit";
/* 
  Smith
*/
export const SMITH_PATH = "/smith";
export const SMITH_CREATE_NEP17_PATH = "/smith/create/nep17";
export const SMITH_CREATE_NEP11_PATH = "/smith/create/nep11";
export const SMITH_CONTRACT_NEP17_PATH = "/smith/nep17/contract";
export const SMITH_CONTRACT_NEP11_PATH = "/smith/nep11/contract";
export const SMITH_PATH_NEP11 = "/smith/nep11";
/* 
  Swap
*/
export const SWAP_PATH = "/swap";
export const SWAP_POOL_PATH = "/pools";
export const SWAP_PATH_HISTORY = "/history";
export const SWAP_PATH_LP_LIST = "/providers";
export const SWAP_PATH_LIQUIDITY_ADD = "/liquidity/add";
export const SWAP_PATH_LIQUIDITY_REMOVE = "/liquidity/remove";
/* 
  Double Farm
*/
export const FARM_V2_PATH = "/double-farm";
export const FARM_V2_STAKE_PATH = "/double-farm/stake";
export const FARM_V2_STAKE_POSITIONS_PATH = "/double-farm/stake/positions";
/* 
  Farm
*/
export const FARM_PATH = "/farm";
export const FARM_STAKE_PATH = "/farm/stake";
export const FARM_STAKE_POSITIONS_PATH = "/farm/stake/positions";
/* 
  Locker
*/
export const LOCKER_PATH = "/locker";
export const LOCKER_CONTRACT_PATH = "/locker/contracts";
export const LOCKER_USER_PATH = "/locker/keys";
export const LOCKER_CREATE_PATH = "/locker/create";
export const LOCKER_SEARCH_PATH = "/locker/search";
/* 
  NFT
*/
export const COLLECTION_PATH = "/NFT/collection";
export const GALLERY_PATH = "/NFT/gallery";
export const BOYZ_PATH = "/NFT/neo-boyz";
export const LP_TOKENS_PATH = "/NFT/lp-tokens";
/* 
  GAS-FI
*/
export const GASFI_PATH = "/gas-fi";
export const GASFI_STAKE_PATH = "/gas-fi/stake";
export const GASFI_MY_STAKING_PATH = "/gas-fi/staking";
/* 
  Bridge
*/
export const BRIDGE_PATH = "/bridge";
/* 
  Analytics
*/
export const ANALYTICS_PATH = "/analytics";
export const ANALYTICS_PAIRS_PATH = "/analytics/pairs";
export const ANALYTICS_TOKENS_PATH = "/analytics/tokens";
/* 
  Archive
*/
export const LOTTO_PATH = "/lotto";
export const ARCHIVE_PATH = "/archive";
export const MIGRATION_PATH = "/migration";
export const TOURNAMENT_PATH = "/arena";
export const IDO_PATH = "/ido";
/* 
  Deprecated
*/
export const DAO_PATH = "/dao";
export const DAO_CHANNEL_CREATE_PATH = "/dao/create";
export const DAO_CHANNEL_PATH = "/dao/channel";

export const BRIDGE_PAGE_ROUTE = {
  label: "Bridge",
  path: BRIDGE_PATH,
  network: [],
  category: [],
};

export const SWAP_PAGE_ROUTE = {
  label: "Swap",
  path: SWAP_PATH,
  network: [TESTNET, MAINNET],
  category: [],
};

export const FARM_PAGE_ROUTE = {
  label: "Farm",
  path: FARM_PATH,
  network: [MAINNET],
  category: [],
};

export const FARM_V2_PAGE_ROUTE = {
  label: "Farm",
  path: FARM_V2_PATH,
  network: [MAINNET, TESTNET],
  category: [],
};

export const LOCKER_PAGE_ROUTE = {
  label: "Locker",
  path: LOCKER_PATH,
  network: [TESTNET, MAINNET],
  category: [],
};

export const SMITH_PAGE_ROUTE = {
  label: "Smith",
  path: SMITH_PATH,
  network: [TESTNET, MAINNET],
  category: [],
};

export const GASFI_PAGE_ROUTE = {
  label: "GAS-Fi",
  path: GASFI_PATH,
  network: [],
  category: [],
};

export const DAO_PAGE_ROUTE = {
  label: "DAO",
  path: DAO_PATH,
  network: [],
  category: [],
};

export const ANALYTICS_ROUTE = {
  label: "Analytics",
  path: ANALYTICS_PATH,
  network: [MAINNET],
  category: [],
};

export const ARCHIVE_ROUTE = {
  label: "Archive",
  path: ARCHIVE_PATH,
  network: [MAINNET],
  category: [
    {
      label: "Arena",
      path: TOURNAMENT_PATH,
      network: [MAINNET],
    },
    {
      label: "Sweepstake",
      path: LOTTO_PATH,
      network: [MAINNET],
      category: [],
    },
    {
      label: "IDO",
      path: IDO_PATH,
      network: [MAINNET],
      category: [],
    },
    {
      label: "Migration",
      path: MIGRATION_PATH,
      network: [PRIVATENET],
      category: [],
    },
  ],
};

export const NFT_ROUTE = {
  label: "NFT",
  path: GALLERY_PATH,
  network: [MAINNET],
  category: [
    {
      label: "Neo Boyz",
      path: BOYZ_PATH,
      network: [MAINNET],
    },
    {
      label: "Runes",
      path: GALLERY_PATH,
      network: [MAINNET],
    },
    {
      label: "LP Tokens",
      path: LP_TOKENS_PATH,
      network: [MAINNET],
    },
    {
      label: "Locker Keys",
      path: LOCKER_SEARCH_PATH,
      network: [MAINNET],
    },
  ],
};

export const MENU = [
  SWAP_PAGE_ROUTE,
  BRIDGE_PAGE_ROUTE,
  // FARM_PAGE_ROUTE,
  FARM_V2_PAGE_ROUTE,
  SMITH_PAGE_ROUTE,
  LOCKER_PAGE_ROUTE,
  GASFI_PAGE_ROUTE,
  ANALYTICS_ROUTE,
  DAO_PAGE_ROUTE,
  NFT_ROUTE,
  ARCHIVE_ROUTE,
];

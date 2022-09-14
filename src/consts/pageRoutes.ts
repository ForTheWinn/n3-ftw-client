import { MAINNET, PRIVATENET, TESTNET } from "../packages/neo/consts";

export const HOME_PATH = "/";
export const MIGRATION_PATH = "/migration";
export const GALLERY_PATH = "/NFT/gallery";
export const TOURNAMENT_PATH = "/arena";
export const IDO_PATH = "/ido";
export const SMITH_PATH = "/smith";
export const SMITH_CREATE_NEP17_PATH = "/smith/create/nep17";
export const SMITH_CREATE_NEP11_PATH = "/smith/create/nep11";
export const SMITH_CONTRACT_NEP17_PATH = "/smith/nep17/contract";
export const SMITH_CONTRACT_NEP11_PATH = "/smith/nep11/contract";
export const SMITH_PATH_NEP11 = "/smith/nep11";
export const COLLECTION_PATH = "/NFT/collection";
export const SWAP_PATH = "/swap";
export const SWAP_POOL_PATH = "/swap/pools";
export const SWAP_PATH_HISTORY = "/swap/history";
export const SWAP_PATH_LP_LIST = "/swap/providers";
export const SWAP_PATH_LIQUIDITY_ADD = "/swap/liquidity/add";
export const SWAP_PATH_LIQUIDITY_REMOVE = "/swap/liquidity/remove";
export const FARM_PATH = "/farm";
export const FARM_STAKE_PATH = "/farm/stake";
export const FARM_STAKE_POSITIONS_PATH = "/farm/stake/positions";
export const DAO_PATH = "/dao";
export const DAO_CHANNEL_CREATE_PATH = "/dao/create";
export const DAO_CHANNEL_PATH = "/dao/channel";
export const LOTTO_PATH = "/lotto";
export const LP_TOKENS_PATH = "/NFT/lp-tokens";
export const ANALYTICS_PATH = "/analytics";
export const ANALYTICS_PAIRS_PATH = "/analytics/pairs";
export const ANALYTICS_TOKENS_PATH = "/analytics/tokens";
export const ARCHIVE_PATH = "/archive";
export const FARM_V2_PATH = "/double-farm";
export const FARM_V2_STAKE_PATH = "/double-farm/stake";
export const FARM_V2_STAKE_POSITIONS_PATH = "/double-farm/stake/positions";
export const LOCKER_PATH = "/locker";
export const LOCKER_CONTRACT_PATH = "/locker/contracts";
export const LOCKER_USER_PATH = "/locker/keys";
export const LOCKER_CREATE_PATH = "/locker/create";
export const LOCKER_SEARCH_PATH = "/locker/search";

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
  label: "Double Farm",
  path: FARM_V2_PATH,
  network: [MAINNET],
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

export const DAO_PAGE_ROUTE = {
  label: "DAO",
  path: DAO_PATH,
  network: [TESTNET],
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
  FARM_PAGE_ROUTE,
  FARM_V2_PAGE_ROUTE,
  SMITH_PAGE_ROUTE,
  LOCKER_PAGE_ROUTE,
  ANALYTICS_ROUTE,
  DAO_PAGE_ROUTE,
  NFT_ROUTE,
  ARCHIVE_ROUTE,
];

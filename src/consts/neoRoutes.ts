import FarmV2 from "../ui/pages/FarmV2";
import Swap from "../ui/pages/Swap";
import { NEO_CHAIN, POLYGON_CHAIN } from "./chains";
import { MAINNET, TESTNET } from "./global";

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
export const SWAP_POOL_PATH = "/swap/pools";
export const SWAP_PATH_HISTORY = "/swap/history";
export const SWAP_PATH_LP_LIST = "/swap/providers";
export const SWAP_PATH_LIQUIDITY_ADD = "/swap/liquidity/add";
export const SWAP_PATH_LIQUIDITY_REMOVE = "/swap/liquidity/remove";
/* 
  Double Farm
*/
export const FARM_V2_PATH = "/double-farm";
export const FARM_V2_STAKE_PATH = "/double-farm/stake";
export const FARM_V2_STAKE_POSITIONS_PATH = "/double-farm/positions";
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
export const NFT_PATH = "/NFT";
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
  Tools
*/
export const TOOLS_PATH = "/tools";
export const TOOLS_AIRDROP_PATH = "/tools/airdrop";
export const TOOLS_LP_TOKENS_PATH = "/tools/lp-tokens";

/* 
  Deprecated
*/
export const DAO_PATH = "/dao";
export const DAO_CHANNEL_CREATE_PATH = "/dao/create";
export const DAO_CHANNEL_PATH = "/dao/channel";

const SWAP_PAGE_ROUTE = {
  label: "Swap",
  path: SWAP_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: []
};

const FARM_V2_PAGE_ROUTE = {
  label: "Farm",
  path: FARM_V2_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET]
  },
  category: []
};

export const ANALYTICS_ROUTE = {
  label: "Analytics",
  path: ANALYTICS_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: []
};

export const ARENA_PAGE_ROUTE = {
  label: "Arena",
  path: TOURNAMENT_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: []
};

export const MIGRATION_PAGE_ROUTE = {
  label: "Migration",
  path: MIGRATION_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: []
};

export const NEO_BOYZ_PAGE_ROUTE = {
  label: "Neo Boyz",
  icon: "/boyz/5.png",
  description: "1111 unique collectible characters stored on Neo blockchain",
  path: BOYZ_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: []
};

export const RUNES_PAGE_ROUTE = {
  label: "Runes",
  icon: "/assets/rune.svg",
  description: "500 algorithms-generated, stored onchain NFT",
  path: GALLERY_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: []
};

const LOCKER_PAGE_ROUTE = {
  label: "Locker",
  icon: "/logo/FTW_KEY.png",
  description: "Send your tokens with a timelock",
  path: LOCKER_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
  },
  category: []
};

const SMITH_PAGE_ROUTE = {
  label: "Smith",
  icon: "/520/smith.png",
  description: "Launch your tokens without codes",
  path: SMITH_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
  },
  category: []
};

const AIRDROP_PAGE_ROUTE = {
  label: "Batch Transfer",
  icon: "",
  description: "",
  path: TOOLS_AIRDROP_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
  },
  category: []
};

export const LP_FINER_PAGE_ROUTE = {
  label: "LP Value Finder",
  path: LP_TOKENS_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: []
};

export const NFT_ROUTE = {
  label: "NFT",
  path: NFT_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
  },
  category: [{ ...NEO_BOYZ_PAGE_ROUTE }, { ...RUNES_PAGE_ROUTE }]
};

const ARCHIVE_ROUTE = {
  label: "Archive",
  path: ARCHIVE_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: [{ ...ARENA_PAGE_ROUTE }, { ...MIGRATION_PAGE_ROUTE }]
};

export const TOOLS_LP_FINER_PAGE_ROUTE = {
  label: "LP Token Value Finder",
  icon: "/logo/FTW_LP.png",
  description: "View LP token value by token id",
  path: TOOLS_LP_TOKENS_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: []
};

export const TOOLS_PAGE_ROUTE = {
  label: "Tools",
  path: TOOLS_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [
    { ...SMITH_PAGE_ROUTE },
    { ...LOCKER_PAGE_ROUTE },
    { ...TOOLS_LP_FINER_PAGE_ROUTE }
    // { ...AIRDROP_PAGE_ROUTE }
  ]
};

export const ROUTES = [
  SWAP_PAGE_ROUTE,
  FARM_V2_PAGE_ROUTE,
  TOOLS_PAGE_ROUTE,
  ANALYTICS_ROUTE,
  NFT_ROUTE,
  ARCHIVE_ROUTE
];

// Pending pages

const FARM_PAGE_ROUTE = {
  label: "Farm",
  path: FARM_PATH,
  network: [MAINNET],
  category: []
};

const BRIDGE_PAGE_ROUTE = {
  label: "Bridge",
  path: BRIDGE_PATH,
  network: [],
  category: []
};

const GASFI_PAGE_ROUTE = {
  label: "GAS-Fi",
  path: GASFI_PATH,
  network: [],
  category: []
};

const DAO_PAGE_ROUTE = {
  label: "DAO",
  path: DAO_PATH,
  network: [],
  category: []
};

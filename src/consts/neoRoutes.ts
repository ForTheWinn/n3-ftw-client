import { FaAdjust, FaArrowUp } from "react-icons/fa";
import Analytics from "../ui/pages/Analytics";
import BrandKit from "../ui/pages/BrandKit";
import Consensus2023 from "../ui/pages/Events/Consensus";
import Farm from "../ui/pages/Farm";
import FarmV2 from "../ui/pages/FarmV2";
import Home from "../ui/pages/Home";
import Locker from "../ui/pages/Locker";
import NFTCollections from "../ui/pages/NFTCollections";
import Boyz from "../ui/pages/NFTCollections/Boyz";
import Fusion from "../ui/pages/NFTCollections/Fusion";
import NFTCollectionMain from "../ui/pages/NFTCollections/Main";
import Rune from "../ui/pages/NFTCollections/Rune";
import Smith from "../ui/pages/Smith";
import Swap from "../ui/pages/Swap";
import Tools from "../ui/pages/Tools";
import Airdrop from "../ui/pages/Tools/scenes/Airdrop";
import LPTokens from "../ui/pages/Tools/scenes/LPTokens";
import ToolsMain from "../ui/pages/Tools/scenes/Main";
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
export const RUNE_PATH = "/NFT/gallery";
export const BOYZ_PATH = "/NFT/neo-boyz";
export const LP_TOKENS_PATH = "/NFT/lp-tokens"; // DO NOT REMOVE: this is used in some NFT descriptions
export const FUSION_PATH = "/NFT/fusion";
export const MATIC_BOYZ_PATH = "/NFT/matic-boyz";
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
  Event
*/
export const EVENT_PATH = "/event";
/* 
  Deprecated
*/
export const DAO_PATH = "/dao";
export const DAO_CHANNEL_CREATE_PATH = "/dao/create";
export const DAO_CHANNEL_PATH = "/dao/channel";

/* 
  DeFi
*/
const SWAP_PAGE_ROUTE = {
  label: "Swap",
  path: SWAP_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  component: Swap
};

const FARM_V2_PAGE_ROUTE = {
  label: "Farm",
  path: FARM_V2_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET]
  },
  category: [],
  component: FarmV2
};

export const ANALYTICS_ROUTE = {
  label: "Analytics",
  path: ANALYTICS_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: [],
  component: Analytics
};

/* 
  NFT Collections
*/

export const NFT_MAIN_PAGE_ROUTE = {
  label: "NFT Collections",
  exact: true,
  path: NFT_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  noShow: true,
  component: NFTCollectionMain
};

export const NEO_BOYZ_PAGE_ROUTE = {
  label: "Neo Boyz",
  icon: "/boyz/5.png",
  description: "1111 unique collectible characters stored on Neo blockchain",
  path: BOYZ_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: [],
  component: Boyz
};

// export const MATIC_BOYZ_PAGE_ROUTE = {
//   label: "Matic Boyz",
//   icon: "/boyz/sample-matic-boy.png",
//   description: "Coming soon",
//   path: BOYZ_PATH,
//   chain: {
//     [NEO_CHAIN]: [MAINNET],
//     [POLYGON_CHAIN]: [MAINNET]
//   },
//   category: [],
//   component: M
// };

export const RUNES_PAGE_ROUTE = {
  label: "Runes",
  icon: "/assets/rune.svg",
  description: "500 algorithms-generated, stored onchain NFT",
  path: RUNE_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: [],
  component: Rune
};

export const FUSION_PAGE_ROUTE = {
  label: "Fusion",
  icon: "/assets/fusion.png",
  description: "NFT Game Collaboration between TOTHEMOON UNIVERSE and FTW.",
  path: FUSION_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: [],
  component: Fusion
};

export const NFT_ROUTE = {
  label: "NFT",
  path: NFT_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
    // [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [
    NFT_MAIN_PAGE_ROUTE,
    NEO_BOYZ_PAGE_ROUTE,
    RUNES_PAGE_ROUTE,
    FUSION_PAGE_ROUTE
  ],
  component: NFTCollections
};

/* 
  Tools
*/

export const TOOLS_MAIN_PAGE_ROUTE = {
  label: "Web3 Tools",
  exact: true,
  path: TOOLS_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  noShow: true,
  component: ToolsMain
};

const LOCKER_PAGE_ROUTE = {
  label: "Locker",
  icon: "/logo/FTW_KEY.png",
  description: "Send your tokens with a timelock",
  path: LOCKER_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  component: Locker
};

const SMITH_PAGE_ROUTE = {
  label: "Smith",
  icon: "/520/smith.png",
  description: "Launch your tokens without codes",
  path: SMITH_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  component: Smith
};

const AIRDROP_PAGE_ROUTE = {
  label: "Batch Transfer",
  // @ts-ignore
  icon: FaArrowUp,
  description: "It helps to transfer multi transfers",
  path: TOOLS_AIRDROP_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  // noShow: true,
  component: Airdrop
};

export const TOOLS_LP_FINDER_PAGE_ROUTE = {
  label: "LP Token Value Finder",
  icon: "/logo/FTW_LP.png",
  description: "Find FTW Swap LP token value by token id",
  path: TOOLS_LP_TOKENS_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  component: LPTokens
};

export const TOOLS_PAGE_ROUTE = {
  label: "Tools",
  path: TOOLS_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [
    TOOLS_MAIN_PAGE_ROUTE,
    SMITH_PAGE_ROUTE,
    LOCKER_PAGE_ROUTE,
    TOOLS_LP_FINDER_PAGE_ROUTE,
    AIRDROP_PAGE_ROUTE
  ],
  component: Tools
};

/*
  Event routes
*/
const EVENT_PAGE_ROUTE = {
  label: "Consensus 2023",
  exact: true,
  path: EVENT_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  noShow: true,
  component: Consensus2023
};

/*
  No show routes
*/

const HOME_PAGE_ROUTE = {
  label: "Home",
  exact: true,
  path: HOME_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  noShow: true,
  component: Home
};

const FARM_PAGE_ROUTE = {
  label: "Farm",
  path: FARM_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET]
  },
  category: [],
  noShow: true,
  component: Farm
};

export const LP_FINDER_PAGE_ROUTE = {
  label: "LP Value Finder",
  path: LP_TOKENS_PATH,
  chain: {
    [NEO_CHAIN]: [TESTNET, MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  noShow: true,
  component: LPTokens
};

const BRAND_PAGE_ROUTE = {
  label: "Brand Kit",
  path: BRAND_KIT_PATH,
  chain: {
    [NEO_CHAIN]: [MAINNET],
    [POLYGON_CHAIN]: [TESTNET, MAINNET]
  },
  category: [],
  noShow: true,
  component: BrandKit
};

export const ROUTES = [
  SWAP_PAGE_ROUTE,
  FARM_V2_PAGE_ROUTE,
  ANALYTICS_ROUTE,
  TOOLS_PAGE_ROUTE,
  NFT_ROUTE,
  EVENT_PAGE_ROUTE,
  // Route only, No menu in display
  LP_FINDER_PAGE_ROUTE,
  FARM_PAGE_ROUTE,
  BRAND_PAGE_ROUTE,
  HOME_PAGE_ROUTE,
  { ...SMITH_PAGE_ROUTE, noShow: true },
  { ...LOCKER_PAGE_ROUTE, noShow: true }
];

// Pending pages

// export const ARENA_PAGE_ROUTE = {
//   label: "Arena",
//   path: TOURNAMENT_PATH,
//   chain: {
//     [NEO_CHAIN]: [MAINNET]
//   },
//   category: []
// };

// export const MIGRATION_PAGE_ROUTE = {
//   label: "Migration",
//   path: MIGRATION_PATH,
//   chain: {
//     [NEO_CHAIN]: [MAINNET]
//   },
//   category: []
// };

// const ARCHIVE_ROUTE = {
//   label: "Archive",
//   path: ARCHIVE_PATH,
//   chain: {
//     [NEO_CHAIN]: [MAINNET]
//   },
//   category: [{ ...ARENA_PAGE_ROUTE }, { ...MIGRATION_PAGE_ROUTE }]
// };

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
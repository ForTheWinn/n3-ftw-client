import {
  B$_SCRIPT_HASH,
  BNEO_SCRIPT_HASH,
  FRANK_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  GLC_SCRIPT_HASH,
  HIST_SCRIPT_HASH,
  LITH_SCRIPT_HASH,
  MAG_SCRIPT_HASH,
  MAXI_SCRIPT_HASH,
  N3F_SCRIPT_HASH,
  NEP_SCRIPT_HASH,
  NUDES_SCRIPT_HASH,
  TED_SCRIPT_HASH,
  TGAS_SCRIPT_HASH,
  TTM_SCRIPT_HASH,
  USDT_SCRIPT_HASH,
  WATT_SCRIPT_HASH,
} from "../../../consts/nep17-list";
import {
  MAINNET,
  TOKEN_CATEGORY_GENERAL,
  TOKEN_CATEGORY_METAVERSE,
  TOKEN_CATEGORY_STARTUPS,
} from "../../../consts";
export const MAINNET_TOKEN_LIST = {
  [NEP_SCRIPT_HASH[MAINNET]]: {
    category: TOKEN_CATEGORY_GENERAL,
    contractHash: NEP_SCRIPT_HASH[MAINNET],
    symbol: "NEP",
    logo: "/symbols/nep.png",
    decimals: 8,
  },
  [GAS_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_GENERAL,
    contractHash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    logo: "/symbols/gas.svg",
    decimals: 8,
  },
  [BNEO_SCRIPT_HASH[MAINNET]]: {
    category: TOKEN_CATEGORY_GENERAL,
    contractHash: BNEO_SCRIPT_HASH[MAINNET],
    symbol: "bNEO",
    logo: "/symbols/bneo.jpeg",
    decimals: 8,
  },
  [USDT_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_GENERAL,
    contractHash: USDT_SCRIPT_HASH,
    symbol: "fUSDT",
    logo: "/symbols/usdt.png",
    decimals: 6,
  },
  // [TTM_SCRIPT_HASH]: {
  //   category: TOKEN_CATEGORY_METAVERSE,
  //   contractHash: TTM_SCRIPT_HASH,
  //   symbol: "TTM",
  //   logo: "/symbols/ttm.png",
  //   decimals: 8,
  // },
  [TGAS_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_METAVERSE,
    contractHash: TGAS_SCRIPT_HASH,
    symbol: "TGAS",
    logo: "/symbols/TGAS.svg",
    decimals: 8,
  },
  [WATT_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_METAVERSE,
    contractHash: WATT_SCRIPT_HASH,
    symbol: "WATT",
    logo: "/symbols/WATT.svg",
    decimals: 8,
  },
  [LITH_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_METAVERSE,
    contractHash: LITH_SCRIPT_HASH,
    symbol: "LITH",
    logo: "/symbols/LITH.svg",
    decimals: 8,
  },
  [HIST_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_METAVERSE,
    contractHash: HIST_SCRIPT_HASH,
    symbol: "HIST",
    logo: "/symbols/HIST.svg",
    decimals: 8,
  },
  [MAG_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_METAVERSE,
    contractHash: MAG_SCRIPT_HASH,
    symbol: "MAG",
    logo: "/symbols/MAG.svg",
    decimals: 8,
  },
  [NUDES_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_STARTUPS,
    contractHash: NUDES_SCRIPT_HASH,
    symbol: "NUDES",
    logo: "/symbols/nudes.png",
    decimals: 8,
  },
  [TED_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_STARTUPS,
    contractHash: TED_SCRIPT_HASH,
    symbol: "TEDS",
    logo: "/symbols/ted.jpg",
    decimals: 8,
  },
  [MAXI_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_STARTUPS,
    contractHash: MAXI_SCRIPT_HASH,
    symbol: "MAXI",
    logo: "/symbols/maxi.png",
    decimals: 8,
  },
  [FRANK_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_STARTUPS,
    contractHash: FRANK_SCRIPT_HASH,
    symbol: "frank",
    logo: "/symbols/frank.png",
    decimals: 8,
  },
  [N3F_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_STARTUPS,
    contractHash: N3F_SCRIPT_HASH,
    symbol: "N3F",
    logo: "/symbols/n3f.jpg",
    decimals: 8,
  },
  // [B$_SCRIPT_HASH]: {
  // 	category: TOKEN_CATEGORY_STARTUPS,
  // 	contractHash: B$_SCRIPT_HASH,
  // 	symbol: "B$",
  // 	logo: "/symbols/battle.png",
  // 	decimals: 8,
  // },
  [GLC_SCRIPT_HASH]: {
    category: TOKEN_CATEGORY_STARTUPS,
    contractHash: GLC_SCRIPT_HASH,
    symbol: "GLC",
    logo: "/symbols/glc.png",
    decimals: 8,
  },
};

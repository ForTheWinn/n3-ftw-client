import {
  BNEO_SCRIPT_HASH,
  FRANK_SCRIPT_HASH,
  FWBTC_SCRIPT_HASH,
  FWETH_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  GLC_SCRIPT_HASH,
  HIST_SCRIPT_HASH,
  HOOD_SCRIPT_HASH,
  LITH_SCRIPT_HASH,
  MAG_SCRIPT_HASH,
  MAXI_SCRIPT_HASH,
  N3F_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
  NEP_SCRIPT_HASH,
  NUDES_SCRIPT_HASH,
  TED_SCRIPT_HASH,
  TGAS_SCRIPT_HASH,
  TTM_SCRIPT_HASH,
  USDT_SCRIPT_HASH,
  WATT_SCRIPT_HASH
} from "./neo-contracts";


import { MAINNET } from "../../../consts/global";


export const MAINNET_TOKEN_LIST = {
  [NEP_SCRIPT_HASH[MAINNET]]: {
    hash: NEP_SCRIPT_HASH[MAINNET],
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8
  },
  [BNEO_SCRIPT_HASH[MAINNET]]: {
    hash: BNEO_SCRIPT_HASH[MAINNET],
    symbol: "bNEO",
    icon: "/symbols/bneo.jpeg",
    decimals: 8
  },
  [GAS_SCRIPT_HASH]: {
    hash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 8
  },
  [FWBTC_SCRIPT_HASH]: {
    hash: FWBTC_SCRIPT_HASH,
    symbol: "fWBTC",
    icon: "/symbols/btc.png",
    decimals: 8
  },
  [FWETH_SCRIPT_HASH]: {
    hash: FWETH_SCRIPT_HASH,
    symbol: "fWETH",
    icon: "/symbols/eth.png",
    decimals: 18
  },
  [USDT_SCRIPT_HASH]: {
    hash: USDT_SCRIPT_HASH,
    symbol: "fUSDT",
    icon: "/symbols/usdt.png",
    decimals: 6
  },
  [TTM_SCRIPT_HASH]: {
    hash: TTM_SCRIPT_HASH,
    symbol: "TTM",
    icon: "/symbols/ttm.png",
    decimals: 8
  },
  [TGAS_SCRIPT_HASH]: {
    hash: TGAS_SCRIPT_HASH,
    symbol: "TGAS",
    icon: "/symbols/TGAS.svg",
    decimals: 8
  },
  [WATT_SCRIPT_HASH]: {
    hash: WATT_SCRIPT_HASH,
    symbol: "WATT",
    icon: "/symbols/WATT.svg",
    decimals: 8
  },
  [LITH_SCRIPT_HASH]: {
    hash: LITH_SCRIPT_HASH,
    symbol: "LITH",
    icon: "/symbols/LITH.svg",
    decimals: 8
  },
  [HIST_SCRIPT_HASH]: {
    hash: HIST_SCRIPT_HASH,
    symbol: "HIST",
    icon: "/symbols/HIST.svg",
    decimals: 8
  },
  [MAG_SCRIPT_HASH]: {
    hash: MAG_SCRIPT_HASH,
    symbol: "MAG",
    icon: "/symbols/MAG.svg",
    decimals: 8
  },
  [HOOD_SCRIPT_HASH]: {
    hash: HOOD_SCRIPT_HASH,
    symbol: "HOOD",
    icon: "/symbols/hood.png",
    decimals: 8
  },
  [NUDES_SCRIPT_HASH]: {
    hash: NUDES_SCRIPT_HASH,
    symbol: "NUDES",
    icon: "/symbols/nudes.png",
    decimals: 8
  },
  [TED_SCRIPT_HASH]: {
    hash: TED_SCRIPT_HASH,
    symbol: "TEDS",
    icon: "/symbols/ted.png",
    decimals: 8
  },
  [MAXI_SCRIPT_HASH]: {
    hash: MAXI_SCRIPT_HASH,
    symbol: "MAXI",
    icon: "/symbols/maxi.png",
    decimals: 8
  },
  [FRANK_SCRIPT_HASH]: {
    hash: FRANK_SCRIPT_HASH,
    symbol: "frank",
    icon: "/symbols/frank.png",
    decimals: 8
  },
  [N3F_SCRIPT_HASH]: {
    hash: N3F_SCRIPT_HASH,
    symbol: "N3F",
    icon: "/symbols/n3f.jpg",
    decimals: 8
  },
  [GLC_SCRIPT_HASH]: {
    hash: GLC_SCRIPT_HASH,
    symbol: "GLC",
    icon: "/symbols/glc.png",
    decimals: 8
  }
};

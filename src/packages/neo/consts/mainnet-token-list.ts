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
  NEP_SCRIPT_HASH,
  NUDES_SCRIPT_HASH,
  TED_SCRIPT_HASH,
  TGAS_SCRIPT_HASH,
  TTM_SCRIPT_HASH,
  USDT_SCRIPT_HASH,
  WATT_SCRIPT_HASH,
  _7F_SCRIPT_HASH
} from "./neo-contracts";

import { MAINNET } from "../../../consts/global";

export const MAINNET_TOKEN_LIST = {
  [NEP_SCRIPT_HASH[MAINNET]]: {
    hash: NEP_SCRIPT_HASH[MAINNET],
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    pairs: [
      BNEO_SCRIPT_HASH[MAINNET],
      GAS_SCRIPT_HASH,
      FWBTC_SCRIPT_HASH,
      FWETH_SCRIPT_HASH,
      USDT_SCRIPT_HASH,
      TTM_SCRIPT_HASH
    ]
  },
  [BNEO_SCRIPT_HASH[MAINNET]]: {
    hash: BNEO_SCRIPT_HASH[MAINNET],
    symbol: "bNEO",
    icon: "/symbols/bneo.jpeg",
    decimals: 8,
    pairs: [
      GAS_SCRIPT_HASH,
      USDT_SCRIPT_HASH,
      NEP_SCRIPT_HASH[MAINNET],
      TTM_SCRIPT_HASH
    ]
  },
  [GAS_SCRIPT_HASH]: {
    hash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 8,
    pairs: [
      BNEO_SCRIPT_HASH[MAINNET],
      NEP_SCRIPT_HASH[MAINNET],
      USDT_SCRIPT_HASH
    ]
  },
  [FWBTC_SCRIPT_HASH]: {
    hash: FWBTC_SCRIPT_HASH,
    symbol: "fWBTC",
    icon: "/symbols/btc.png",
    decimals: 8,
    pairs: [NEP_SCRIPT_HASH[MAINNET]]
  },
  [FWETH_SCRIPT_HASH]: {
    hash: FWETH_SCRIPT_HASH,
    symbol: "fWETH",
    icon: "/symbols/eth.png",
    decimals: 18,
    pairs: [NEP_SCRIPT_HASH[MAINNET]]
  },
  [USDT_SCRIPT_HASH]: {
    hash: USDT_SCRIPT_HASH,
    symbol: "fUSDT",
    icon: "/symbols/usdt.png",
    decimals: 6,
    pairs: [
      NEP_SCRIPT_HASH[MAINNET],
      TTM_SCRIPT_HASH,
      BNEO_SCRIPT_HASH[MAINNET]
    ]
  },
  [TTM_SCRIPT_HASH]: {
    hash: TTM_SCRIPT_HASH,
    symbol: "TTM",
    icon: "/symbols/ttm.png",
    decimals: 8,
    pairs: [
      NEP_SCRIPT_HASH[MAINNET],
      USDT_SCRIPT_HASH,
      BNEO_SCRIPT_HASH[MAINNET]
    ]
  },
  [TGAS_SCRIPT_HASH]: {
    hash: TGAS_SCRIPT_HASH,
    symbol: "TGAS",
    icon: "/symbols/TGAS.svg",
    decimals: 8,
    pairs: []
  },
  [WATT_SCRIPT_HASH]: {
    hash: WATT_SCRIPT_HASH,
    symbol: "WATT",
    icon: "/symbols/WATT.svg",
    decimals: 8,
    pairs: []
  },
  [LITH_SCRIPT_HASH]: {
    hash: LITH_SCRIPT_HASH,
    symbol: "LITH",
    icon: "/symbols/LITH.svg",
    decimals: 8,
    pairs: []
  },
  [HIST_SCRIPT_HASH]: {
    hash: HIST_SCRIPT_HASH,
    symbol: "HIST",
    icon: "/symbols/HIST.svg",
    decimals: 8,
    pairs: []
  },
  [MAG_SCRIPT_HASH]: {
    hash: MAG_SCRIPT_HASH,
    symbol: "MAG",
    icon: "/symbols/MAG.svg",
    decimals: 8,
    pairs: []
  },
  [HOOD_SCRIPT_HASH]: {
    hash: HOOD_SCRIPT_HASH,
    symbol: "HOOD",
    icon: "/symbols/hood.png",
    decimals: 8,
    pairs: []
  },
  [NUDES_SCRIPT_HASH]: {
    hash: NUDES_SCRIPT_HASH,
    symbol: "TIPS",
    icon: "/symbols/tips.svg",
    decimals: 8,
    pairs: []
  },
  [TED_SCRIPT_HASH]: {
    hash: TED_SCRIPT_HASH,
    symbol: "TEDS",
    icon: "/symbols/ted.png",
    decimals: 8,
    pairs: []
  },
  [MAXI_SCRIPT_HASH]: {
    hash: MAXI_SCRIPT_HASH,
    symbol: "MAXI",
    icon: "/symbols/maxi.png",
    decimals: 8,
    pairs: []
  },
  [FRANK_SCRIPT_HASH]: {
    hash: FRANK_SCRIPT_HASH,
    symbol: "frank",
    icon: "/symbols/frank.png",
    decimals: 8,
    pairs: []
  },
  [N3F_SCRIPT_HASH]: {
    hash: N3F_SCRIPT_HASH,
    symbol: "N3F",
    icon: "/symbols/n3f.jpg",
    decimals: 8,
    pairs: []
  },
  [GLC_SCRIPT_HASH]: {
    hash: GLC_SCRIPT_HASH,
    symbol: "GLC",
    icon: "/symbols/glc.png",
    decimals: 8,
    pairs: []
  },
  [_7F_SCRIPT_HASH]: {
    hash: _7F_SCRIPT_HASH,
    symbol: "7f",
    icon: "/symbols/7f.png",
    decimals: 8,
    pairs: []
  }
};

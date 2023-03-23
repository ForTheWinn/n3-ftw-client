import { CONST } from "../../../index";
import { INetworkType } from "../../../network";
import {
  BNEO_SCRIPT_HASH,
  FLM_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  GM_SCRIPT_HASH,
  LRB_SCRIPT_HASH,
  NEO_SCRIPT_HASH
} from "../../../consts/neo-token-hashes";
import { MAINNET } from "../../../consts";

export const LAUNCH_AT = 1655229600000; // June 14th 6PM UTC (11AM LA)
export const END_AT = 1655827200000; // June 14th 6PM UTC (11AM LA)
export const TOTAL_TOKENS_FOR_SALE = 50_000_000;

// IDO Hash to address NVEuiwucYuzBrDFp36NHqT5EPkB1HDv8M2

export const IDO_SCRIPT_HASH = {
  [CONST.PRIVATENET]: "8baedfbb355ca3a7dacea69884c47fea2c254e66",
  [CONST.TESTNET]: "8baedfbb355ca3a7dacea69884c47fea2c254e66",
  [CONST.MAINNET]: "8baedfbb355ca3a7dacea69884c47fea2c254e66"
};

export const payments = (network: INetworkType) => [
  {
    contractHash: NEO_SCRIPT_HASH,
    symbol: "NEO",
    logo: "/symbols/neo.svg",
    decimals: 0,
    amount: 1200
  },
  {
    contractHash: BNEO_SCRIPT_HASH[MAINNET],
    symbol: "bNEO",
    logo: "/symbols/bneo.jpeg",
    decimals: 8,
    amount: 1200
  },
  {
    contractHash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    logo: "/symbols/gas.svg",
    decimals: 8,
    amount: 300
  },
  {
    contractHash: FLM_SCRIPT_HASH[network],
    symbol: "FLM",
    logo: "/symbols/flm.svg",
    decimals: 8,
    amount: 10
  },
  {
    contractHash: GM_SCRIPT_HASH[network],
    symbol: "GM",
    logo: "/symbols/gm.svg",
    decimals: 8,
    amount: 4
  },
  {
    contractHash: LRB_SCRIPT_HASH[network],
    symbol: "LRB",
    logo: "/symbols/lrb.svg",
    decimals: 8,
    amount: 3
  }
];

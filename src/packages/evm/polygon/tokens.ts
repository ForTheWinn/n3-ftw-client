import { POLYGON_TESTNET_CONTRACTS } from ".";
import { POLYGON_MAINNET_CONTRACTS } from ".";
import { createTokenMetadata } from "../../../common/helpers";
import {
  FNEO_LOGO,
  MAINNET,
  POLYGON_LOGO,
  TESTNET,
} from "../../../consts/global";

export const POLYGON_MAINNET_TOKENS = [
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.NEP,
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.FNEO,
    symbol: "ftwNEO",
    icon: FNEO_LOGO,
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.USDT,
    symbol: "USDT",
    icon: "/symbols/usdt.png",
    decimals: 6,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.WBTC,
    symbol: "WBTC",
    icon: "/symbols/btc.png",
    decimals: 8,
  }),
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.WETH,
    symbol: "WETH",
    icon: "/symbols/eth.png",
    decimals: 18,
  }),
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.WMATIC,
    symbol: "WMATIC",
    icon: "/symbols/wmatic.png",
    decimals: 18,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.MATIC,
    symbol: "MATIC",
    icon: POLYGON_LOGO,
    decimals: 18,
    isWhitelisted: true,
    isNative: true,
    nativePair: {
      hash: POLYGON_MAINNET_CONTRACTS.WMATIC,
      symbol: "WMATIC",
      decimals: 18,
    },
  }),
];

export const POLYGON_TESTNET_FNEO_METADATA = {
  hash: POLYGON_TESTNET_CONTRACTS.FNEO,
  symbol: "ftwNEO",
  icon: FNEO_LOGO,
  decimals: 8,
};

export const POLYGON_TESTNET_TOKENS = [
  createTokenMetadata({
    hash: POLYGON_TESTNET_CONTRACTS.NEP,
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: POLYGON_TESTNET_CONTRACTS.WMATIC,
    symbol: "WMATIC",
    icon: "/symbols/wmatic.png",
    decimals: 18,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: POLYGON_MAINNET_CONTRACTS.MATIC,
    symbol: "Matic",
    icon: "/symbols/matic.png",
    decimals: 18,
    isWhitelisted: true,
    isNative: true,
    nativePair: {
      hash: POLYGON_TESTNET_CONTRACTS.WMATIC,
      symbol: "WMATIC",
      decimals: 18,
    },
  }),
];
export const POLYGON_TOKENS = {
  [MAINNET]: POLYGON_MAINNET_TOKENS,
  [TESTNET]: POLYGON_TESTNET_TOKENS,
};

import { ETHEREUM_MAINNET_CONTRACTS, ETHEREUM_TESTNET_CONTRACTS } from ".";
import { createTokenMetadata } from "../../../common/helpers";
import { FNEO_LOGO, MAINNET, NEO_LOGO, TESTNET } from "../../../consts/global";

export const ETHEREUM_MAINNET_TOKENS = [
  createTokenMetadata({
    hash: ETHEREUM_MAINNET_CONTRACTS.NEP,
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: ETHEREUM_MAINNET_CONTRACTS.FNEO,
    symbol: "ftwNEO",
    icon: FNEO_LOGO,
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: ETHEREUM_MAINNET_CONTRACTS.USDT,
    symbol: "USDT",
    icon: "/symbols/usdt.png",
    decimals: 6,
    isWhitelisted: true,
  }),
  // createTokenMetadata({
  //   hash: ETHEREUM_MAINNET_CONTRACTS.WETH,
  //   symbol: "WETH",
  //   icon: "/symbols/eth.png",
  //   decimals: 18,
  //   isWhitelisted: true,
  // }),
  // createTokenMetadata({
  //   hash: ETHEREUM_MAINNET_CONTRACTS.WBTC,
  //   symbol: "WBTC",
  //   icon: "/symbols/btc.png",
  //   decimals: 8,
  //   isWhitelisted: true,
  // }),
  // createTokenMetadata({
  //   hash: ETHEREUM_MAINNET_CONTRACTS.ETH,
  //   symbol: "ETH",
  //   icon: "/symbols/eth.png",
  //   decimals: 18,
  //   isWhitelisted: true,
  //   isNative: true,
  //   nativePair: {
  //     hash: ETHEREUM_MAINNET_CONTRACTS.WETH,
  //     symbol: "WETH",
  //     decimals: 18,
  //   },
  // }),
];

export const ETHEREUM_TESTNET_TOKENS = [
  createTokenMetadata({
    hash: ETHEREUM_TESTNET_CONTRACTS.NEP,
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: ETHEREUM_TESTNET_CONTRACTS.FNEO,
    symbol: "ftwNEO",
    icon: NEO_LOGO,
    decimals: 8,
    isWhitelisted: true,
  }),
];

export const ETHEREUM_TOKENS = {
  [MAINNET]: ETHEREUM_MAINNET_TOKENS,
  [TESTNET]: ETHEREUM_TESTNET_TOKENS,
};

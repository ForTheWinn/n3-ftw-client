import { MAINNET, TESTNET } from "../../../consts/global";
import { createTokenMetadata } from "../../../common/helpers";
import { BASE_MAINNET_CONTRACTS } from ".";

export const NEOX_MAINNET_TOKENS = [
  createTokenMetadata({
    hash: BASE_MAINNET_CONTRACTS.NEP,
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: BASE_MAINNET_CONTRACTS.ETH,
    symbol: "ETH",
    icon: "/symbols/eth.svg",
    decimals: 18,
    isWhitelisted: true,
    isNative: true,
    nativePair: {
      hash: BASE_MAINNET_CONTRACTS.WETH,
      symbol: "WETH",
      decimals: 18,
    },
  }),
  createTokenMetadata({
    hash: BASE_MAINNET_CONTRACTS.WETH,
    symbol: "WETH",
    icon: "/symbols/weth.svg",
    decimals: 18,
    isWhitelisted: true,
  }),
];

export const BASE_CHAIN_TOKENS = {
  [MAINNET]: NEOX_MAINNET_TOKENS,
  [TESTNET]: NEOX_MAINNET_TOKENS,
};

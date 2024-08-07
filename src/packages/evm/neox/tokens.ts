import { NEOX_MAINNET_CONTRACTS, NEOX_TESTNET_CONTRACTS } from ".";
import { FNEO_LOGO, MAINNET, TESTNET } from "../../../consts/global";
import { createTokenMetadata } from "../../../common/helpers";

export const NEOX_MAINNET_TOKENS = [
  // createTokenMetadata({
  //   hash: NEOX_MAINNET_CONTRACTS.NEP,
  //   symbol: "NEP",
  //   icon: "/symbols/nep.png",
  //   decimals: 8,
  //   isWhitelisted: true,
  // }),
  createTokenMetadata({
    hash: NEOX_MAINNET_CONTRACTS.GAS,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 18,
    isWhitelisted: true,
    isNative: true,
    nativePair: {
      hash: NEOX_MAINNET_CONTRACTS.WGAS,
      symbol: "WGAS",
      decimals: 18,
    },
  }),
  createTokenMetadata({
    hash: NEOX_MAINNET_CONTRACTS.WGAS,
    symbol: "WGAS",
    icon: "/symbols/gas.svg",
    decimals: 18,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: "0xE816deE05cf6D0F2a57EB4C489241D8326B5d106",
    symbol: "NDMEME",
    icon: "/symbols/NDMEME.png",
    decimals: 18,
    isWhitelisted: true,
  }),
];

export const NEOX_TESTNET_TOKENS = [
  createTokenMetadata({
    hash: NEOX_TESTNET_CONTRACTS.NEP,
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEOX_TESTNET_CONTRACTS.FNEO,
    symbol: "fNEO",
    icon: FNEO_LOGO,
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEOX_TESTNET_CONTRACTS.GAS,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 18,
    isWhitelisted: true,
    isNative: true,
    nativePair: {
      hash: NEOX_TESTNET_CONTRACTS.WGAS,
      symbol: "WGAS",
      decimals: 18,
    },
  }),
  createTokenMetadata({
    hash: NEOX_TESTNET_CONTRACTS.WGAS,
    symbol: "WGAS",
    icon: "/symbols/gas.svg",
    decimals: 18,
    isWhitelisted: true,
  }),
];

export const NEOX_TOKENS = {
  [MAINNET]: NEOX_MAINNET_TOKENS,
  [TESTNET]: NEOX_TESTNET_TOKENS,
};

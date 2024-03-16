import { NEOX_MAINNET_CONTRACTS } from ".";
import { FNEO_LOGO, MAINNET, NEO_LOGO, TESTNET } from "../../../consts/global";
import { createTokenMetadata } from "../../../common/helpers";
import FNEO from "../../../ui/pages/FNEO";

export const NEOX_MAINNET_TOKENS = [
  createTokenMetadata({
    hash: NEOX_MAINNET_CONTRACTS.NEP,
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEOX_MAINNET_CONTRACTS.FNEO,
    symbol: "fNEO",
    icon: FNEO_LOGO,
    decimals: 8,
    isWhitelisted: true,
  }),
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
  // createTokenMetadata({
  //   hash: NEOX_MAINNET_CONTRACTS.TEST1,
  //   symbol: "TRY",
  //   icon: "/symbols/nep.png",
  //   decimals: 18,
  //   isWhitelisted: true,
  // }),
  // createTokenMetadata({
  //   hash: NEOX_MAINNET_CONTRACTS.TEST2,
  //   symbol: "SMITH",
  //   icon: "/symbols/nep.png",
  //   decimals: 18,
  //   isWhitelisted: true,
  // }),
];

export const NEOX_TOKENS = {
  [MAINNET]: NEOX_MAINNET_TOKENS,
  [TESTNET]: NEOX_MAINNET_TOKENS,
};

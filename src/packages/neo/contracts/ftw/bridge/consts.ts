import {
  ETH_CHAIN,
  MAINNET,
  POLYGON_CHAIN,
  TESTNET,
} from "../../../../../consts/global";

export const NEO_BRIDGE_SCRIPT_HASH = {
  [POLYGON_CHAIN]: {
    [TESTNET]: "0x994cb116be32059b7f2dfc0e439801672fc09ca9",
    [MAINNET]: "0xefb83544ca01b8e169998d5348d9b9ec81529a52",
  },
  [ETH_CHAIN]: {
    [TESTNET]: "0xa0f2ed465dadf56e3cb11ad610edb0603f2e2067",
    [MAINNET]: "0x46cd58fd7119686db6dab0eda1cc81a6a802de4b",
  },
};

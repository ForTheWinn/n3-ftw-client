import {
  ETH_CHAIN,
  MAINNET,
  NEOX_CHAIN,
  NEO_CHAIN,
  POLYGON_CHAIN,
  TESTNET,
} from "./global";

export const EXPLORER_URLS = {
  [NEO_CHAIN]: {
    [MAINNET]: {
      tx: "https://explorer.onegate.space/transactionInfo",
      account: "https://explorer.onegate.space/accountprofile",
      contract: "https://explorer.onegate.space/contractinfo",
    },
    [TESTNET]: {
      tx: "https://testmagnet.explorer.onegate.space/transactionInfo",
      account: "https://testmagnet.explorer.onegate.space/accountprofile",
      contract: "https://testmagnet.explorer.onegate.space/contractinfo",
    },
  },
  [POLYGON_CHAIN]: {
    [MAINNET]: {
      tx: "https://polygonscan.com/tx",
      account: "https://polygonscan.com/address",
      contract: "https://polygonscan.com/token",
    },
    [TESTNET]: {
      tx: "https://mumbai.polygonscan.com/tx",
      account: "https://mumbai.polygonscan.com/address",
      contract: "https://mumbai.polygonscan.com/token",
    },
  },
  [ETH_CHAIN]: {
    [MAINNET]: {
      tx: "https://etherscan.io/tx",
      account: "https://etherscan.io/address",
      contract: "https://etherscan.io/token",
    },
    [TESTNET]: {
      tx: "https://goerli.etherscan.io/tx",
      account: "https://goerli.etherscan.io/address",
      contract: "https://goerli.etherscan.io/token",
    },
  },
  [NEOX_CHAIN]: {
    [MAINNET]: {
      tx: "https://xt2scan.ngd.network/tx",
      account: "https://xt2scan.ngd.network/address",
      contract: "https://xt2scan.ngd.network/token",
    },
    [TESTNET]: {
      tx: "https://xt2scan.ngd.network/tx",
      account: "https://xt2scan.ngd.network/address",
      contract: "https://xt2scan.ngd.network/token",
    },
  },
};

import { MAINNET, NEO_CHAIN, POLYGON_CHAIN, TESTNET } from "./global";

export const explorerUrls = {
  [NEO_CHAIN]: {
    [MAINNET]: {
      tx: "https://explorer.onegate.space/transactionInfo",
      account: "https://explorer.onegate.space/accountprofile",
      contract: "https://explorer.onegate.space/contractinfo"
    },
    [TESTNET]: {
      tx: "https://testmagnet.explorer.onegate.space/transactionInfo",
      account: "https://testmagnet.explorer.onegate.space/accountprofile",
      contract: "https://testmagnet.explorer.onegate.space/contractinfo"
    }
  },
  [POLYGON_CHAIN]: {
    [MAINNET]: {
      tx: "https://polygonscan.com/tx",
      account: "https://polygonscan.com/address",
      contract: "https://polygonscan.com/token"
    },
    [TESTNET]: {
      tx: "https://mumbai.polygonscan.com/tx",
      account: "https://mumbai.polygonscan.com/address",
      contract: "https://mumbai.polygonscan.com/token"
    }
  }
};

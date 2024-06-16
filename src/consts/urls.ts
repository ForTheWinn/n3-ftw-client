import { NEOX_MAINNET_CHAIN_DETAIL, NEOX_TESTNET_CHAIN_DETAIL } from "./chains";
import {
  BASE_CHAIN,
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
      tx: `${NEOX_MAINNET_CHAIN_DETAIL.blockExplorers.default.url}/tx`,
      account: `${NEOX_MAINNET_CHAIN_DETAIL.blockExplorers.default.url}/address`,
      contract: `${NEOX_MAINNET_CHAIN_DETAIL.blockExplorers.default.url}/token`,
    },
    [TESTNET]: {
      tx: `${NEOX_TESTNET_CHAIN_DETAIL.blockExplorers.default.url}/tx`,
      account: `${NEOX_TESTNET_CHAIN_DETAIL.blockExplorers.default.url}/address`,
      contract: `${NEOX_TESTNET_CHAIN_DETAIL.blockExplorers.default.url}/token`,
    },
  },
  [BASE_CHAIN]: {
    [MAINNET]: {
      tx: "https://basescan.org/tx",
      account: "https://basescan.org/address",
      contract: "https://basescan.org/token",
    },
    [TESTNET]: {
      tx: "https://basescan.org/tx",
      account: "https://basescan.org/address",
      contract: "https://basescan.org/token",
    },
  },
};

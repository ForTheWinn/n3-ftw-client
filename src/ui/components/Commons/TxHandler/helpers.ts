import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../../consts/chains";
import { TESTNET } from "../../../../packages/neo/consts";
import { INetworkType } from "../../../../packages/neo/network";

export const getTxBrowser = (chain: CHAINS, network: INetworkType) => {
  switch (chain) {
    case NEO_CHAIN:
      if (network === TESTNET) {
        return `https://testmagnet.onegate.space/transactionInfo/`;
      } else {
        return `https://explorer.onegate.space/transactionInfo/`;
      }
    case POLYGON_CHAIN:
      if (network === TESTNET) {
        return `https://mumbai.polygonscan.com/tx/`;
      } else {
        return `https://polygonscan.com/tx/`;
      }
  }
};

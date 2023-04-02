import { NEO_CHAIN, POLYGON_CHAIN } from "../consts/chains";
import { MAINNET } from "../consts/global";
import { INetworkType } from "../packages/neo/network";

export const getChainId = (chain: string): number => {
  switch (chain) {
    case POLYGON_CHAIN:
      return 80001;
    default:
      return 1;
  }
};

export const getExploler = (chain: string, network: INetworkType): string => {
  switch (chain) {
    case NEO_CHAIN:
      if (network === MAINNET) {
        return "https://explorer.onegate.space/transactionInfo";
      } else {
        return "https://testmagnet.explorer.onegate.space/transactionInfo";
      }
    case POLYGON_CHAIN:
      if (network === MAINNET) {
        return "https://polygonscan.com/tx";
      } else {
        return "https://mumbai.polygonscan.com/tx";
      }
    default:
      return "";
  }
};

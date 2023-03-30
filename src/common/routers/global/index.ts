import { waitForTransaction } from "@wagmi/core";
import {
  CHAINS,
  NEO_CHAIN,
  POLYGON_CHAIN
} from "../../../consts/chains";
import { INetworkType, Network } from "../../../packages/neo/network";

export const waitTransactionUntilSubmmited = async (
  chain: CHAINS,
  network: INetworkType,
  txid: string
): Promise<boolean> => {
  switch (chain) {
    case POLYGON_CHAIN:
       const data = await waitForTransaction({
        hash: txid as `0x${string}`
        });
      return true;
      case NEO_CHAIN:
      const res = await Network.getRawTx(txid, network);
      return true;
  }
};

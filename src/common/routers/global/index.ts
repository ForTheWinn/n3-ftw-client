import { waitForTransaction, fetchToken } from "@wagmi/core";
import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { INetworkType, Network } from "../../../packages/neo/network";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";

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

export const fetchTokenInfo = async (
  chain: CHAINS,
  network: INetworkType,
  hash: string
): Promise<ITokenState> => {
  switch (chain) {
    case POLYGON_CHAIN:
      const data = await fetchToken(hash as any);
      return {
        hash,
        decimals: data.decimals,
        symbol: data.symbol,
        icon: ""
      };
    case NEO_CHAIN:
      const scripts: any = [];
      const script1 = {
        scriptHash: hash,
        operation: "symbol",
        args: []
      };
      const script2 = {
        scriptHash: hash,
        operation: "decimals",
        args: []
      };
      scripts.push(script1);
      scripts.push(script2);
      const res = await Network.read(network, scripts);
      return {
        hash,
        symbol: res.stack[0].value as string,
        decimals: res.stack[1].value as number,
        icon: ""
      };
  }
};

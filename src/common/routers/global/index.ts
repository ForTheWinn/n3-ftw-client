import { waitForTransaction, fetchToken } from "@wagmi/core";
import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { INetworkType, Network } from "../../../packages/neo/network";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import { IPrices } from "../../../packages/neo/api/interfaces";
import { RestAPI } from "../../../packages/neo/api";
import { MAINNET } from "../../../consts/global";
import { base64ToString } from "../../../packages/neo/utils";
import { WENT_WRONG } from "../../../consts/messages";
import { SwapContract } from "../../../packages/neo/contracts/ftw/swap";
import { fetchBalance } from "@wagmi/core";

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

export const getPrices = async (chain: CHAINS): Promise<IPrices> => {
  return new RestAPI(MAINNET).getPrices();

  // switch (chain) {
  //   case NEO_CHAIN:
  //     return new RestAPI(MAINNET).getPrices();
  //   // case POLYGON_CHAIN:
  //   //   return undefined;
  // }
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
      if (res.state === "FAULT") {
        throw new Error(res.exception ? res.exception : WENT_WRONG);
      }
      return {
        hash,
        symbol: base64ToString(res.stack[0].value as string),
        decimals: res.stack[1].value as number,
        icon: ""
      };
  }
};

export const fetchTokenBalance = async (
  chain: CHAINS,
  network: INetworkType,
  address: string,
  tokenHash: string
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      return await new SwapContract(network).getUserBalance(address, tokenHash);
    case POLYGON_CHAIN:
      const res = await fetchBalance({
        address,
        token: tokenHash
      } as any);
      return res.formatted;
  }
};

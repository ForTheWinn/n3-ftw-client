import { fetchBalance, writeContract } from "@wagmi/core";
import { CHAINS } from "../../../consts/chains";
import { INetworkType } from "../../../packages/neo/network";
import {
  getTokenURI as getPolygonLPToken,
  getLPTokens as getPolygonLPTokens,
  getEstimated as polygonGetEstimated,
  getReserves as polygonGetReserves,
  removeLiquidity as polygonRemoveLiquidity,
} from "../../../packages/polygon/contracts/swap";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import {
  ISwapReserves,
  ISwapEstimateArgs,
  IUserTokenBalances,
  ISwapLPToken,
} from "./interfaces";
import { SwapContract } from "../../../packages/neo/contracts";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/global";
import { getUserBalance } from "../../../packages/neo/utils";

export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<ISwapReserves> => {
  switch (chain) {
    case NEO_CHAIN:
      return await new SwapContract(network).getReserve(tokenA, tokenB);
    case POLYGON_CHAIN:
      return await polygonGetReserves(network, tokenA, tokenB);
  }
};

export const getBalances = async (
  chain: CHAINS,
  network: INetworkType,
  address: string,
  tokenA: ITokenState,
  tokenB: ITokenState
): Promise<IUserTokenBalances> => {
  let amountA;
  let amountB;
  switch (chain) {
    case NEO_CHAIN:
      amountA = await getUserBalance(network, address, tokenA.hash);
      amountB = await getUserBalance(network, address, tokenB.hash);
      break;
    case POLYGON_CHAIN:
      const res1 = await fetchBalance({
        address,
        token: tokenA.hash,
      } as any);
      const res2 = await fetchBalance({
        address,
        token: tokenB.hash,
      } as any);
      amountA = res1.formatted;
      amountB = res2.formatted;
      break;
  }
  return {
    amountA,
    amountB,
  };
};

export const getEstimate = async (
  chain: CHAINS,
  network: INetworkType,
  args: ISwapEstimateArgs
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      if (args.isReverse) {
        return new SwapContract(network).getSwapBEstimate(
          args.tokenA,
          args.tokenB,
          args.amount
        );
      } else {
        return new SwapContract(network).getSwapEstimate(
          args.tokenA,
          args.tokenB,
          args.isReverse ? args.tokenB : args.tokenA,
          args.amount
        );
      }
    case POLYGON_CHAIN:
      return polygonGetEstimated(network, args);
  }
};

export const removeLiquidity = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string,
  connectedWallet?: IConnectedWallet
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      if (connectedWallet) {
        const txid = new SwapContract(network).remove(connectedWallet, tokenId);
        return txid;
      } else {
        throw new Error("Conneect wallet.");
      }
    case POLYGON_CHAIN:
      const config = (await polygonRemoveLiquidity(network, tokenId)) as any;
      const res = await writeContract(config);
      return res.hash;
  }
};

export const getLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  address?: string
): Promise<ISwapLPToken[]> => {
  if (!address) return [];
  switch (chain) {
    case NEO_CHAIN:
      const tokens: ISwapLPToken[] = [];
      const res = await new SwapContract(network).getLPTokens(address);
      for (const token of res) {
        tokens.push({
          tokenId: token.tokenId,
          tokenA: token.tokenA,
          tokenB: token.tokenB,
          symbolA: token.symbolA,
          symbolB: token.symbolB,
          amountA: token.amountA,
          amountB: token.amountB,
          decimalsA: token.decimalsA,
          decimalsB: token.decimalsB,
          sharesPercentage: token.sharesPercentage.toString(),
        });
      }
      return tokens;
    case POLYGON_CHAIN:
      return getPolygonLPTokens(network, address);
  }
};

export const getLPToken = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
): Promise<ISwapLPToken | undefined> => {
  switch (chain) {
    case NEO_CHAIN:
      const res = await new SwapContract(network).getProperties(tokenId);
      return {
        tokenId: res.tokenId,
        tokenA: res.tokenA,
        tokenB: res.tokenB,
        symbolA: res.symbolA,
        symbolB: res.symbolB,
        amountA: res.amountA,
        amountB: res.amountB,
        decimalsA: res.decimalsA,
        decimalsB: res.decimalsB,
        sharesPercentage: res.sharesPercentage.toString(),
      };
    case POLYGON_CHAIN:
      return getPolygonLPToken(network, tokenId);
  }
};

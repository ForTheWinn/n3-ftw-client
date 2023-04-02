import { fetchBalance } from "@wagmi/core";
import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { INetworkType } from "../../../packages/neo/network";
import {
  getEstimated as polygonGetEstimated,
  getReserves as polygonGetReserves
} from "../../../packages/polygon/swap";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import {
  ISwapReserves,
  ISwapEstimateArgs,
  IUserTokenBalances
} from "./interfaces";
import { SwapContract } from "../../../packages/neo/contracts";

export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: ITokenState,
  tokenB: ITokenState
): Promise<ISwapReserves> => {
  switch (chain) {
    case NEO_CHAIN:
      const res = await new SwapContract(network).getReserve(
        tokenA.hash,
        tokenB.hash
      );
      return {
        reserveA: res.pair[tokenA.hash].reserveAmount.toString(),
        reserveB: res.pair[tokenB.hash].reserveAmount.toString(),
        shares: res.totalShare.toString()
      };
    case POLYGON_CHAIN:
      return await polygonGetReserves(network, tokenA, tokenB);
  }
};

export const getBalances = async (
  chain: CHAINS,
  network: INetworkType,
  address: `0x${string}`,
  tokenA: `0x${string}`,
  tokenB: `0x${string}`
): Promise<IUserTokenBalances> => {
  let amountA;
  let amountB;
  switch (chain) {
    case NEO_CHAIN:
      return await new SwapContract(network).getUserBalances(
        address,
        tokenA,
        tokenB
      );
    case POLYGON_CHAIN:
      const res1 = await fetchBalance({
        address,
        token: tokenA
      });
      const res2 = await fetchBalance({
        address,
        token: tokenB
      });
      amountA = res1.formatted;
      amountB = res2.formatted;
      break;
  }
  return {
    amountA,
    amountB
  };
};
export const getEstimate = async (
  chain: CHAINS,
  network: INetworkType,
  args: ISwapEstimateArgs,
  decimals: number
) => {
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
      return polygonGetEstimated(network, args, decimals);
  }
};

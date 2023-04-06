import { fetchBalance } from "@wagmi/core";
import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { INetworkType } from "../../../packages/neo/network";
import {
  getEstimated as polygonGetEstimated,
  getReserves as polygonGetReserves,
  removeLiquidity as polygonRemoveLiquidity
} from "../../../packages/polygon/contracts/swap";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import {
  ISwapReserves,
  ISwapEstimateArgs,
  IUserTokenBalances
} from "./interfaces";
import { SwapContract } from "../../../packages/neo/contracts";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import { ethers } from "ethers";

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
  address: string,
  tokenA: ITokenState,
  tokenB: ITokenState
): Promise<IUserTokenBalances> => {
  let amountA;
  let amountB;
  switch (chain) {
    case NEO_CHAIN:
      const res = await new SwapContract(network).getUserBalances(
        address,
        tokenA.hash,
        tokenB.hash
      );
      console.log(res)
      amountA = ethers.utils.formatUnits(res.amountA, tokenA.decimals);
      amountB = ethers.utils.formatUnits(res.amountB, tokenB.decimals);
      break;
    case POLYGON_CHAIN:
      const res1 = await fetchBalance({
        address,
        token: tokenA.hash
      } as any);
      const res2 = await fetchBalance({
        address,
        token: tokenB.hash
      } as any);
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

export const getLPEstimate = async (
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

export const removeLiquidity = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string,
  connectedWallet?: IConnectedWallet
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      if (connectedWallet) {
        return new SwapContract(network).remove(connectedWallet, tokenId);
      } else {
        throw new Error("Conneect wallet.");
      }

    case POLYGON_CHAIN:
      return polygonRemoveLiquidity(network, tokenId) as any;
  }
};

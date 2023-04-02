import { fetchBalance } from "@wagmi/core";
import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { INetworkType } from "../../../packages/neo/network";
import {
  getEstimated as polygonGetEstimated,
  getReserves as polygonGetReserves
} from "../../../packages/polygon/swap";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import { ITokenBalances, SwapEstimateArgs } from "./interfaces";

export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: ITokenState,
  tokenB: ITokenState
) => {
  switch (chain) {
    case NEO_CHAIN:
      return await polygonGetReserves(network, tokenA, tokenB);
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
): Promise<ITokenBalances> => {
  let amountA;
  let amountB;
  switch (chain) {
    case NEO_CHAIN:
      //   return new RestAPI(MAINNET).getPrices();
      break;
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
  args: SwapEstimateArgs,
  decimals: number
) => {
  switch (chain) {
    case NEO_CHAIN:
      //   return new RestAPI(MAINNET).getPrices();
      break;
    case POLYGON_CHAIN:
      return polygonGetEstimated(network, args, decimals);
  }
};

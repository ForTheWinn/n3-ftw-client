import { readContract, prepareWriteContract } from "@wagmi/core";
import { ethers } from "ethers";
import { POLYGON_SWAP_CONTRACT_HASH } from ".";
import {
  IReservesState,
  ITokenState,
} from "../../ui/pages/Swap/scenes/Swap/interfaces";
import FTWSwapABI from "./FTWSwap.json";

export const getReserves = async (
  tokenA: ITokenState,
  tokenB: ITokenState
): Promise<IReservesState> => {
  const res: any = await readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "getReserves",
    args: [tokenA.hash, tokenB.hash],
  });
  return {
    reserveA:
      res.tokenA === tokenA.hash
        ? ethers.utils.formatUnits(res.amountA, tokenA.decimals).toString()
        : ethers.utils.formatUnits(res.amountB, tokenA.decimals).toString(),
    reserveB:
      res.tokenB === tokenB.hash
        ? ethers.utils.formatUnits(res.amountB, tokenB.decimals).toString()
        : ethers.utils.formatUnits(res.amountA, tokenB.decimals).toString(),
    shares: res.shares.toString(),
  };
};

export const getEstimated = (args) => {
  return readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "getSwapEstimated",
    args,
  });
};

export const getLPEstimate = (
  amount: number,
  decimals: number,
  opponentDecimals: number,
  reserveAmount: string,
  opponentReserveAmount: string
): string => {
  const _amount = ethers.utils.parseUnits(amount.toString(), decimals);
  let estimated = _amount
    .mul(ethers.utils.parseUnits(opponentReserveAmount, opponentDecimals))
    .div(ethers.utils.parseUnits(reserveAmount, decimals));
  return ethers.utils.formatUnits(estimated, opponentDecimals);
};

export const swap = (args) => {
  return prepareWriteContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "swap",
    args: args,
  });
};

export const provide = (args) => {
  return prepareWriteContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "addLiquidity",
    args: args,
  });
};

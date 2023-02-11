import {
  readContract,
  prepareWriteContract,
  erc20ABI,
  multicall,
} from "@wagmi/core";
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

export const getLPTokens = (owner: string) => {
  return readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "getTokensOf",
    args: [owner],
  });
};

// export const getLPTokenIds = (owner: string) => {
//   return readContract({
//     address: POLYGON_SWAP_CONTRACT_HASH,
//     abi: FTWSwapABI,
//     functionName: "tokenOfOwnerByIndex",
//     args: [owner],
//   });
// };

export const getTokenURI = (tokenId: number) => {
  return readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "tokenURI",
    args: [tokenId],
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
    args,
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

export const removeLiquidity = (tokenId: string) => {
  return prepareWriteContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "removeLiquidity",
    args: [tokenId],
  });
};

export const approve = (token) => {
  return prepareWriteContract({
    address: token,
    abi: erc20ABI,
    functionName: "approve",
    args: [POLYGON_SWAP_CONTRACT_HASH, ethers.constants.MaxUint256],
  });
};

export const getAllowances = (
  address: string,
  tokenA: string,
  tokenB: string
) => {
  return multicall({
    contracts: [
      {
        address: tokenA as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address as `0x${string}`, POLYGON_SWAP_CONTRACT_HASH],
      },
      {
        address: tokenB as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address as `0x${string}`, POLYGON_SWAP_CONTRACT_HASH],
      },
    ],
  });
};

export const isApprovedForAll = (owner: string) => {
  return readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "isApprovedForAll",
    args: [owner, POLYGON_SWAP_CONTRACT_HASH],
  });
};

export const setApprovalForAll = () => {
  return prepareWriteContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "setApprovalForAll",
    args: [POLYGON_SWAP_CONTRACT_HASH, true],
  });
};

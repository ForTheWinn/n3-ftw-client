import {
  readContract,
  prepareWriteContract,
  erc20ABI,
  multicall
} from "@wagmi/core";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { CONSTS } from ".";
import {
  IReservesState,
  ITokenState
} from "../../ui/pages/Swap/scenes/Swap/interfaces";
import FTWSwapABI from "./FTWSwap.json";
import { IFarmLPToken } from "../../common/routers/farm/interfaces";
import { INetworkType } from "../neo/network";
import { GLOBAL } from "../../consts";
import { AddLiquidityArgs, SwapArgs, SwapEstimateArgs } from "./interfaces";

export const getReserves = async (
  network: INetworkType,
  tokenA: ITokenState,
  tokenB: ITokenState
): Promise<IReservesState> => {
  const res: any = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getReserves",
    args: [tokenA.hash, tokenB.hash]
  });
  return {
    reserveA:
      res.tokenA === tokenA.hash
        ? ethers.utils.formatUnits(res.amountA, tokenA.decimals)
        : ethers.utils.formatUnits(res.amountB, tokenA.decimals),
    reserveB:
      res.tokenB === tokenB.hash
        ? ethers.utils.formatUnits(res.amountB, tokenB.decimals)
        : ethers.utils.formatUnits(res.amountA, tokenB.decimals),
    shares: res.shares.toString()
  };
};

export const getReserve = async (
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<any> => {
  return readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getReserves",
    args: [tokenA, tokenB]
  });
};

export const getEstimated = async (
  network: INetworkType,
  args: SwapEstimateArgs,
  decimals: number
): Promise<string> => {
  const { tokenA, tokenB, amount, isReverse } = args;
  const res = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getSwapEstimated",
    args: [tokenA, tokenB, amount, isReverse]
  });
  return ethers.utils.formatUnits(res as number, decimals);
};

export const getLPTokens = async (
  network: INetworkType,
  owner: string
): Promise<IFarmLPToken[]> => {
  const res: any = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getTokensOf",
    args: [owner]
  });
  const tokens: IFarmLPToken[] = [];

  for (const tokenId of res) {
    const token = await getTokenURI(network, tokenId.toString());
    tokens.push(token);
  }
  return tokens;
};

export const getTokenURI = async (
  network: INetworkType,
  tokenId: string
): Promise<IFarmLPToken> => {
  console.log(tokenId);
  const res = (await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "tokenURI",
    args: [tokenId]
  })) as string;
  const json = Buffer.from(res.substring(29), "base64").toString();
  const jsonObject = JSON.parse(json);
  return {
    name: jsonObject.name,
    tokenA: jsonObject.tokenA,
    tokenB: jsonObject.tokenB,
    symbolA: jsonObject.symbolA,
    symbolB: jsonObject.symbolB,
    tokenId: tokenId.toString(),
    amountA: ethers.utils.formatUnits(jsonObject.amountA, jsonObject.decimalsA),
    amountB: ethers.utils.formatUnits(jsonObject.amountB, jsonObject.decimalsB),
    sharesPercentage: (parseFloat(jsonObject.shares) / 10000).toString() // BPS
  };
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

export const swap = (network: INetworkType, args: SwapArgs) => {
  const { tokenA, tokenB, amountIn, amountOut, isReverse } = args;
  console.log(tokenA);
  console.log(tokenB);
  console.log(amountIn);
  console.log(amountOut);
  console.log(isReverse);
  return prepareWriteContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "swap",
    args: [tokenA, tokenB, amountIn, amountOut, isReverse]
  });
};

export const provide = (network: INetworkType, args: AddLiquidityArgs) => {
  const { tokenA, tokenB, amountA, amountB, slippage } = args;
  return prepareWriteContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "addLiquidity",
    args: [tokenA, amountA, tokenB, amountB, slippage]
  });
};

export const removeLiquidity = (network: INetworkType, tokenId: string) => {
  return prepareWriteContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "removeLiquidity",
    args: [tokenId]
  });
};

export const approve = (network: INetworkType, token) => {
  return prepareWriteContract({
    address: token,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
      ethers.constants.MaxUint256
    ]
  });
};

export const getAllowances = (
  network: INetworkType,
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
        args: [
          address as `0x${string}`,
          CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as `0x${string}`
        ]
      },
      {
        address: tokenB as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [
          address as `0x${string}`,
          CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as `0x${string}`
        ]
      }
    ]
  });
};

export const isApprovedForAll = (
  network: INetworkType,
  owner: string,
  contractHash: string
) => {
  return readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "isApprovedForAll",
    args: [owner, contractHash]
  });
};

export const setApprovalForAll = (
  network: INetworkType,
  contractHash: string
) => {
  return prepareWriteContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "setApprovalForAll",
    args: [contractHash, true]
  });
};

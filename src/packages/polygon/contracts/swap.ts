import {
  readContract,
  prepareWriteContract,
  erc20ABI,
  multicall
} from "@wagmi/core";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { CONSTS } from "..";
import FTWSwapABI from "./abi/FTWSwap.json";
import { INetworkType } from "../../neo/network";
import { GLOBAL } from "../../../consts";
import { AddLiquidityArgs, SwapArgs, SwapEstimateArgs } from "../interfaces";
import {
  ISwapLPToken,
  ISwapReserves
} from "../../../common/routers/swap/interfaces";

export const getReserves = async (
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<ISwapReserves> => {
  const res: any = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getReserves",
    args: [tokenA, tokenB]
  });
  // EVM swap doesn't change token order in the contract so we need to check its order by token hash
  return {
    reserveA:
      res.tokenA === tokenA ? res.amountA.toString() : res.amountB.toString(),
    reserveB:
      res.tokenB === tokenB ? res.amountB.toString() : res.amountA.toString(),
    shares: res.shares.toString()
  };
};

export const getEstimated = async (
  network: INetworkType,
  args: SwapEstimateArgs
): Promise<string> => {
  const { tokenA, tokenB, amount, isReverse } = args;
  const res = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getSwapEstimated",
    args: [tokenA, tokenB, amount, isReverse]
  });
  return res as string;
};

export const getLPTokens = async (
  network: INetworkType,
  owner: string
): Promise<ISwapLPToken[]> => {
  const res: any = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getTokensOf",
    args: [owner]
  });
  const tokens: ISwapLPToken[] = [];

  for (const tokenId of res) {
    const token = await getTokenURI(network, tokenId.toString());
    tokens.push(token);
  }
  return tokens;
};

export const getTokenURI = async (
  network: INetworkType,
  tokenId: string
): Promise<ISwapLPToken> => {
  const res = (await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.SWAP] as any,
    abi: FTWSwapABI,
    functionName: "tokenURI",
    args: [tokenId]
  })) as string;
  const json = Buffer.from(res.substring(29), "base64").toString();
  const jsonObject = JSON.parse(json);
  return {
    tokenId: tokenId.toString(),
    tokenA: jsonObject.tokenA,
    tokenB: jsonObject.tokenB,
    symbolA: jsonObject.symbolA,
    symbolB: jsonObject.symbolB,
    decimalsA: jsonObject.decimalsA,
    decimalsB: jsonObject.decimalsB,
    amountA: jsonObject.amountA,
    amountB: jsonObject.amountB,
    sharesPercentage: jsonObject.sharesPercentage
  };
};

export const swap = (network: INetworkType, args: SwapArgs) => {
  const { tokenA, tokenB, amountIn, amountOut, isReverse } = args;
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

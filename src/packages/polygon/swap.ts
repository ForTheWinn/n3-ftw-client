import {
  readContract,
  prepareWriteContract,
  erc20ABI,
  multicall,
} from "@wagmi/core";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { POLYGON_SWAP_CONTRACT_HASH } from ".";
import {
  IReservesState,
  ITokenState,
} from "../../ui/pages/Swap/scenes/Swap/interfaces";
import FTWSwapABI from "./FTWSwap.json";
import { IFarmLPToken } from "../../common/routers/farm/interfaces";

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
        ? ethers.utils.formatUnits(res.amountA, tokenA.decimals)
        : ethers.utils.formatUnits(res.amountB, tokenA.decimals),
    reserveB:
      res.tokenB === tokenB.hash
        ? ethers.utils.formatUnits(res.amountB, tokenB.decimals)
        : ethers.utils.formatUnits(res.amountA, tokenB.decimals),
    shares: res.shares.toString(),
  };
};

export const getReserve = async (
  tokenA: string,
  tokenB: string
): Promise<any> => {
  return readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "getReserves",
    args: [tokenA, tokenB],
  });
};

export const getEstimated = (args) => {
  return readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "getSwapEstimated",
    args,
  });
};

export const getLPTokens = async (owner: string): Promise<IFarmLPToken[]> => {
  const res: any = await readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "getTokensOf",
    args: [owner],
  });
  const tokens: IFarmLPToken[] = [];

  for (const tokenId of res) {
    const token = await getTokenURI(tokenId.toString());
    tokens.push(token)
  }

  return tokens;
};

export const getTokenURI = async (tokenId: string): Promise<IFarmLPToken> => {
  console.log(tokenId)
  const res = await readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "tokenURI",
    args: [tokenId],
  }) as string;
   const json = Buffer.from(res.substring(29), "base64").toString();
  const jsonObject = JSON.parse(json);
  console.log(jsonObject)
   return{
      name: jsonObject.name,
      tokenA: jsonObject.tokenA,
      tokenB: jsonObject.tokenB,
      symbolA: jsonObject.symbolA,
      symbolB: jsonObject.symbolB,
      tokenId: tokenId.toString(),
      amountA: ethers.utils.formatUnits(jsonObject.amountA, jsonObject.decimalsA),
      amountB: ethers.utils.formatUnits(jsonObject.amountB, jsonObject.decimalsB), 
      sharesPercentage: (parseFloat(jsonObject.shares) / 10000).toString(), // BPS
    }
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

export const isApprovedForAll = (owner: string, contractHash: string) => {
  return readContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "isApprovedForAll",
    args: [owner, contractHash],
  });
};

export const setApprovalForAll = (contractHash: string) => {
  return prepareWriteContract({
    address: POLYGON_SWAP_CONTRACT_HASH,
    abi: FTWSwapABI,
    functionName: "setApprovalForAll",
    args: [contractHash, true],
  });
};

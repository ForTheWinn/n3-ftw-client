import {
  readContract,
  prepareWriteContract,
  erc20ABI,
  multicall,
  writeContract,
} from "@wagmi/core";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import FTWSwapABI from "./abi/FTWSwap.json";
import { INetworkType } from "../../neo/network";
import { AddLiquidityArgs, SwapArgs, SwapEstimateArgs } from "../interfaces";
import {
  ISwapLPToken,
  ISwapReserves,
} from "../../../common/routers/swap/interfaces";
import { POLYGON_CONTRACT_MAP } from "../consts";
import { SWAP } from "../../../consts/global";
import { CHAINS } from "../../../consts/chains";
import { CONTRACT_MAP } from "../../../consts/contracts";

export const getReserves = async (
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<ISwapReserves> => {
  const res: any = await readContract({
    address: POLYGON_CONTRACT_MAP[network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getReserves",
    args: [tokenA, tokenB],
  });
  // EVM swap doesn't change token order in the contract so we need to check its order by token hash
  return {
    reserveA:
      res.tokenA.toLowerCase() === tokenA.toLowerCase()
        ? res.amountA.toString()
        : res.amountB.toString(),
    reserveB:
      res.tokenB.toLowerCase() === tokenB.toLowerCase
        ? res.amountB.toString()
        : res.amountA.toString(),
    shares: res.shares.toString(),
  };
};

export const getEstimated = async (
  network: INetworkType,
  args: SwapEstimateArgs
): Promise<string> => {
  const { tokenA, tokenB, amount, isReverse } = args;
  const res = await readContract({
    address: POLYGON_CONTRACT_MAP[network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getSwapEstimated",
    args: [tokenA, tokenB, amount, isReverse],
  });
  return res ? res.toString() : "0";
};

export const getLPTokens = async (
  network: INetworkType,
  owner: string
): Promise<ISwapLPToken[]> => {
  const res: any = await readContract({
    address: POLYGON_CONTRACT_MAP[network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "getTokensOf",
    args: [owner],
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
    address: POLYGON_CONTRACT_MAP[network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "tokenURI",
    args: [tokenId],
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
    sharesPercentage: jsonObject.sharesPercentage,
  };
};

export const swap = async (
  chain: CHAINS,
  network: INetworkType,
  args: SwapArgs
): Promise<string> => {
  const { tokenA, tokenB, amountIn, amountOut, isReverse } = args;
  const config = await prepareWriteContract({
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "swap",
    args: [tokenA, tokenB, amountIn, amountOut, isReverse],
  });
  const { hash } = await writeContract(config);
  return hash;
};

export const provide = async (
  chain: CHAINS,
  network: INetworkType,
  args: AddLiquidityArgs
): Promise<string> => {
  const { tokenA, tokenB, amountA, amountB, slippage } = args;
  const config = await prepareWriteContract({
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "addLiquidity",
    args: [tokenA, amountA, tokenB, amountB, slippage],
  });

  const { hash } = await writeContract(config);
  return hash;
};

export const removeLiquidity = (network: INetworkType, tokenId: string) => {
  return prepareWriteContract({
    address: POLYGON_CONTRACT_MAP[network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "removeLiquidity",
    args: [tokenId],
  });
};

export const approve = async (
  contractAddress: any,
  spenderAddress: any
): Promise<string> => {
  const script = await prepareWriteContract({
    address: contractAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [spenderAddress, ethers.constants.MaxUint256.toBigInt()],
  });
  const { hash } = await writeContract(script);
  return hash;
};

export const getAllowances = async (
  chain: CHAINS,
  network: INetworkType,
  address: string,
  tokenAddresses: string[],
  spender: string,
) => {
  const res = await multicall({
    contracts: tokenAddresses.map((token) => ({
      address: token as `0x${string}`,
      abi: erc20ABI,
      functionName: "allowance",
      args: [
        address as `0x${string}`,
        spender as `0x${string}`,
      ],
    })),
  });
  return res.map((r) => r.result);
};

export const isApprovedForAll = (
  network: INetworkType,
  owner: string,
  contractHash: string
) => {
  return readContract({
    address: POLYGON_CONTRACT_MAP[network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "isApprovedForAll",
    args: [owner, contractHash],
  });
};

export const setApprovalForAll = (
  network: INetworkType,
  contractHash: string
) => {
  return prepareWriteContract({
    address: POLYGON_CONTRACT_MAP[network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "setApprovalForAll",
    args: [contractHash, true],
  });
};

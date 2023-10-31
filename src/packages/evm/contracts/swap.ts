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
import { SWAP } from "../../../consts/global";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { CONTRACT_MAP } from "../../../consts/contracts";
import { EVM_CONTRACT_MAP } from "..";
import { usdtABI } from "../../../common/helpers";

export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<ISwapReserves> => {
  const address = EVM_CONTRACT_MAP[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const res: any = await readContract({
    address,
    abi: FTWSwapABI,
    functionName: "getReserves",
    args: [tokenA, tokenB],
    chainId,
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
  chain: CHAINS,
  network: INetworkType,
  args: SwapEstimateArgs
): Promise<string> => {
  const address = EVM_CONTRACT_MAP[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const { tokenA, tokenB, amount, isReverse } = args;
  const res = await readContract({
    address,
    abi: FTWSwapABI,
    functionName: "getSwapEstimated",
    args: [tokenA, tokenB, amount, isReverse],
    chainId,
  });
  return res ? res.toString() : "0";
};

export const getLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  owner: string
): Promise<ISwapLPToken[]> => {
  const address = EVM_CONTRACT_MAP[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const res: any = await readContract({
    address,
    abi: FTWSwapABI,
    functionName: "getTokensOf",
    args: [owner],
    chainId,
  });
  const tokens: ISwapLPToken[] = [];

  for (const tokenId of res) {
    const token = await getTokenURI(chain, network, tokenId.toString());
    tokens.push(token);
  }
  return tokens;
};

export const getTokenURI = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
): Promise<ISwapLPToken> => {
  const address = EVM_CONTRACT_MAP[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const res = (await readContract({
    address,
    abi: FTWSwapABI,
    functionName: "tokenURI",
    args: [tokenId],
    chainId,
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
  const chainId = CONFIGS[network][chain].chainId;
  const config = await prepareWriteContract({
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "swap",
    args: [tokenA, tokenB, amountIn, amountOut, isReverse],
    chainId,
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
  const chainId = CONFIGS[network][chain].chainId;
  const config = await prepareWriteContract({
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "addLiquidity",
    args: [tokenA, amountA, tokenB, amountB, slippage],
    chainId,
  });

  const { hash } = await writeContract(config);
  return hash;
};

export const removeLiquidity = (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
) => {
  const address = EVM_CONTRACT_MAP[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  return prepareWriteContract({
    address,
    abi: FTWSwapABI,
    functionName: "removeLiquidity",
    args: [tokenId],
    chainId,
  });
};

export const approve = async (
  chain: CHAINS,
  network: INetworkType,
  contractAddress: any,
  spenderAddress: any
): Promise<string> => {
  const chainId = CONFIGS[network][chain].chainId;
  const script = await prepareWriteContract({
    address: contractAddress,
    abi: usdtABI,
    functionName: "approve",
    args: [spenderAddress, ethers.MaxUint256],
    chainId,
  });
  const { hash } = await writeContract(script);
  return hash;
};

export const getAllowances = async (
  chain: CHAINS,
  network: INetworkType,
  address: string,
  tokenAddresses: string[],
  spender: string
) => {
  const chainId = CONFIGS[network][chain].chainId;
  const res = await multicall({
    contracts: tokenAddresses.map((token) => ({
      address: token as `0x${string}`,
      abi: erc20ABI,
      functionName: "allowance",
      args: [address as `0x${string}`, spender as `0x${string}`],
      chainId,
    })),
  });
  return res.map((r) => r.result);
};

export const isApprovedForAll = (
  chain: CHAINS,
  network: INetworkType,
  owner: string,
  contractHash: string
) => {
  const address = EVM_CONTRACT_MAP[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  return readContract({
    address,
    abi: FTWSwapABI,
    functionName: "isApprovedForAll",
    args: [owner, contractHash],
    chainId,
  });
};

export const setApprovalForAll = async (
  chain: CHAINS,
  network: INetworkType,
  contractHash: string
): Promise<string> => {
  const address = EVM_CONTRACT_MAP[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const config = await prepareWriteContract({
    address,
    abi: FTWSwapABI,
    functionName: "setApprovalForAll",
    args: [contractHash, true],
    chainId,
  });
  const { hash } = await writeContract(config);
  return hash;
};

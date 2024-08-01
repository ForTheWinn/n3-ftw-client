import {
  readContract,
  writeContract,
  simulateContract,
  estimateGas,
} from "@wagmi/core";
import { erc20Abi } from "viem";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import FTWSwapABI from "./abi/FTWSwap.json";
import WMATIC_ABI from "./abi/WMATIC.json";
import { INetworkType } from "../../neo/network";
import { AddLiquidityArgs, SwapArgs, SwapEstimateArgs } from "../interfaces";
import {
  ISwapLPToken,
  ISwapReserves,
} from "../../../common/routers/swap/interfaces";
import { SWAP } from "../../../consts/global";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { CONTRACT_MAP } from "../../../consts/contracts";
import { EVM_CONTRACTS } from "..";
import { usdtABI } from "./abi/usdtABI";
import { wagmiConfig } from "../../../wagmi-config";
import { IToken } from "../../../consts/tokens";

export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<ISwapReserves> => {
  const address = EVM_CONTRACTS[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const res: any = await readContract(wagmiConfig, {
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
      res.tokenB.toLowerCase() === tokenB.toLowerCase()
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
  const { tokenA, tokenB, amount, isReverse } = args;
  const res = await readContract(wagmiConfig, {
    address: EVM_CONTRACTS[chain][network][SWAP],
    abi: FTWSwapABI,
    functionName: "getSwapEstimated",
    args: [tokenA, tokenB, amount, isReverse],
    chainId: CONFIGS[network][chain].chainId,
  });
  return res ? res.toString() : "0";
};

export const getLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  owner: string
): Promise<ISwapLPToken[]> => {
  const address = EVM_CONTRACTS[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const res: any = await readContract(wagmiConfig, {
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
  const address = EVM_CONTRACTS[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  const res: any = await readContract(wagmiConfig, {
    address,
    abi: FTWSwapABI,
    functionName: "tokenURI",
    args: [tokenId],
    chainId,
  });
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

export const wrapNative = async (
  chain: CHAINS,
  network: INetworkType,
  nativeContract: any,
  amount: string
): Promise<string> => {
  const chainId = CONFIGS[network][chain].chainId;
  const args: any = {
    chainId,
    address: nativeContract as any,
    abi: WMATIC_ABI,
    functionName: "deposit",
    args: [],
    value: amount,
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const unWrapNative = async (
  chain: CHAINS,
  network: INetworkType,
  nativeContract: any,
  amount: string
): Promise<string> => {
  const chainId = CONFIGS[network][chain].chainId;
  const args: any = {
    chainId,
    address: nativeContract as any,
    abi: WMATIC_ABI,
    functionName: "withdraw",
    args: [amount],
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const wrapAndSwap = async (
  chain: CHAINS,
  network: INetworkType,
  args: {
    tokenA: IToken;
    tokenB: IToken;
    amountIn: bigint;
    amountOut: bigint;
  }
) => {
  const { tokenA, tokenB, amountIn, amountOut } = args;
  const chainId = CONFIGS[network][chain].chainId;
  const script: any = {
    chainId,
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "wrapAndSwap",
    args: [tokenA.nativePair?.hash, tokenB.hash, amountOut],
    value: amountIn,
  };
  await simulateContract(wagmiConfig, script);
  return await writeContract(wagmiConfig, script);
};

export const swapAndUnwrap = async (
  chain: CHAINS,
  network: INetworkType,
  args: {
    tokenA: IToken;
    tokenB: IToken;
    amountIn: bigint;
    amountOut: bigint;
    isReverse: boolean;
  }
): Promise<string> => {
  const { tokenA, tokenB, amountIn, amountOut, isReverse } = args;
  const chainId = CONFIGS[network][chain].chainId;
  const script = {
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "swapAndUnWrap",
    args: [
      tokenA.hash,
      tokenB.nativePair?.hash,
      amountIn,
      amountOut,
      isReverse,
    ],
    chainId,
  };
  await simulateContract(wagmiConfig, script);
  return await writeContract(wagmiConfig, script);
};

export const swap = async (
  chain: CHAINS,
  network: INetworkType,
  params: SwapArgs
): Promise<string> => {
  const { tokenA, tokenB, amountIn, amountOut, isReverse } = params;
  const chainId = CONFIGS[network][chain].chainId;
  const args = {
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "swap",
    args: [tokenA, tokenB, amountIn, amountOut, isReverse],
    chainId,
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const provide = async (
  chain: CHAINS,
  network: INetworkType,
  params: AddLiquidityArgs
): Promise<string> => {
  const { tokenA, tokenB, amountA, amountB, slippage } = params;
  const args = {
    address: CONTRACT_MAP[chain][network][SWAP] as any,
    abi: FTWSwapABI,
    functionName: "addLiquidity",
    args: [tokenA, amountA, tokenB, amountB, slippage],
    chainId: CONFIGS[network][chain].chainId,
  };
  await simulateContract(wagmiConfig, args);
  const gasEstimate = await estimateGas(wagmiConfig, args);
  const bufferPercentage: number = 1.2;
  const gasLimit: bigint =
    (gasEstimate * BigInt(Math.ceil(bufferPercentage * 100))) / BigInt(100);
  return await writeContract(wagmiConfig, {
    ...args,
    gasLimit,
  });
};

export const removeLiquidity = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
) => {
  const args = {
    address: EVM_CONTRACTS[chain][network][SWAP],
    abi: FTWSwapABI,
    functionName: "removeLiquidity",
    args: [tokenId],
    chainId: CONFIGS[network][chain].chainId,
  };
  await simulateContract(wagmiConfig, args);
  return writeContract(wagmiConfig, args);
};

export const approve = async (
  chain: CHAINS,
  network: INetworkType,
  contractAddress: any,
  spenderAddress: any
): Promise<string> => {
  const args = {
    address: contractAddress,
    abi: usdtABI,
    functionName: "approve",
    args: [spenderAddress, ethers.MaxUint256],
    chainId: CONFIGS[network][chain].chainId,
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const getAllowances = async (
  chain: CHAINS,
  network: INetworkType,
  address: string,
  tokenAddresses: string[],
  spender: string
) => {
  const chainId = CONFIGS[network][chain].chainId;

  // An array to hold the promises for each readContract call
  const promises = tokenAddresses.map((tokenAddress) =>
    readContract(wagmiConfig, {
      address: tokenAddress as any,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address as any, spender as any],
      chainId,
    })
  );

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Return the results directly, assuming results contain the allowance data
  return results.map((r) => {
    return r;
  }); // Adjust according to how readContract returns data
};

// export const getAllowances = async (
//   chain: CHAINS,
//   network: INetworkType,
//   address: string,
//   tokenAddresses: string[],
//   spender: string
// ) => {
//   const chainId = CONFIGS[network][chain].chainId;
//   const res = await multicall(wagmiConfig, {
//     contracts: tokenAddresses.map((token) => ({
//       address: token as `0x${string}`,
//       abi: erc20Abi,
//       functionName: "allowance",
//       args: [address as `0x${string}`, spender as `0x${string}`],
//       chainId,
//     })),
//   });
//   return res.map((r) => r.result);
// };

export const isApprovedForAll = (
  chain: CHAINS,
  network: INetworkType,
  owner: string,
  contractHash: string
) => {
  const address = EVM_CONTRACTS[chain][network][SWAP];
  const chainId = CONFIGS[network][chain].chainId;
  return readContract(wagmiConfig, {
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
  const args = {
    address: EVM_CONTRACTS[chain][network][SWAP],
    abi: FTWSwapABI,
    functionName: "setApprovalForAll",
    args: [contractHash, true],
    chainId: CONFIGS[network][chain].chainId,
  };

  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

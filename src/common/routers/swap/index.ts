import { getBalance } from "@wagmi/core";
import { CHAINS } from "../../../consts/chains";
import { INetworkType } from "../../../packages/neo/network";
import {
  getTokenURI as evmGetLPToken,
  getLPTokens as evmGetLPTokens,
  getEstimated as evmGetEstimated,
  getReserves as evmGetReserves,
  removeLiquidity as evmRemoveLiquidity,
} from "../../../packages/evm/contracts/swap";
import { IToken } from "../../../consts/tokens";
import {
  ISwapReserves,
  ISwapEstimateArgs,
  IUserTokenBalances,
  ISwapLPToken,
} from "./interfaces";
import { SwapContract } from "../../../packages/neo/contracts";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import { NEO_CHAIN } from "../../../consts/global";
import { getUserBalance } from "../../../packages/neo/utils";
import { getChainIdByChain } from "../../helpers";
import { wagmiConfig } from "../../../wagmi-config";

export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<ISwapReserves> => {
  switch (chain) {
    case NEO_CHAIN:
      return await new SwapContract(network).getReserve(tokenA, tokenB);
    default:
      return await evmGetReserves(chain, network, tokenA, tokenB);
  }
};

export const getBalances = async (
  chain: CHAINS,
  network: INetworkType,
  address: string,
  tokenA: IToken,
  tokenB: IToken
): Promise<IUserTokenBalances> => {
  let amountA;
  let amountB;
  switch (chain) {
    case NEO_CHAIN:
      amountA = await getUserBalance(network, address, tokenA.hash);
      amountB = await getUserBalance(network, address, tokenB.hash);
      break;
    default:
      const res1 = await getBalance(wagmiConfig, {
        address,
        token: tokenA.isNative ? undefined : tokenA.hash,
        chainId: getChainIdByChain(chain, network),
      } as any);
      const res2 = await getBalance(wagmiConfig, {
        address,
        token: tokenB.isNative ? undefined : tokenB.hash,
        chainId: getChainIdByChain(chain, network),
      } as any);
      amountA = res1.formatted;
      amountB = res2.formatted;
      break;
  }
  return {
    amountA,
    amountB,
  };
};

export const getEstimate = async (
  chain: CHAINS,
  network: INetworkType,
  args: ISwapEstimateArgs
): Promise<string> => {
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
    default:
      return evmGetEstimated(chain, network, args);
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
        const txid = new SwapContract(network).remove(connectedWallet, tokenId);
        return txid;
      } else {
        throw new Error("Conneect wallet.");
      }
    default:
      return await evmRemoveLiquidity(chain, network, tokenId);
  }
};

export const getLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  address?: string
): Promise<ISwapLPToken[]> => {
  if (!address) return [];
  switch (chain) {
    case NEO_CHAIN:
      return await new SwapContract(network).getLPTokens(address);
    default:
      return evmGetLPTokens(chain, network, address);
  }
};

export const getLPToken = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
): Promise<ISwapLPToken | undefined> => {
  switch (chain) {
    case NEO_CHAIN:
      return await new SwapContract(network).getProperties(tokenId);
    default:
      return evmGetLPToken(chain, network, tokenId);
  }
};

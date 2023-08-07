import { globalRouter } from "./routers";
import {
  MAINNET,
  NEO_CHAIN,
  NEO_MAINNET_CHAIN_ID,
  NEO_TESTNET_CHAIN_ID,
  POLYGON_CHAIN,
  POLYGON_MAINNET_CHAIN_ID,
  POLYGON_TESTNET_CHAIN_ID,
  TESTNET,
} from "../consts/global";
import { TOKEN_LIST } from "../consts/tokens";
import { INetworkType } from "../packages/neo/network";
import { ITokenState } from "../ui/pages/Swap/scenes/Swap/interfaces";
import { explorerUrls } from "../consts/urls";
import { CHAINS } from "../consts/chains";
import { erc20ABI, prepareWriteContract, writeContract } from "@wagmi/core";
import { BigNumber, ethers } from "ethers";

export const getExplorer = (
  chain: string,
  network: INetworkType,
  type: "tx" | "account" | "contract"
): string => {
  const explorerUrl = explorerUrls[chain]?.[network]?.[type];
  return explorerUrl || "";
};

export const getExplorerByChainId = (
  chainId: number,
  type: "tx" | "account" | "contract"
): string => {
  const chain = getChainByChainId(chainId);
  const network = getNetworkByChainId(chainId);
  return getExplorer(chain, network, type);
};

// Helper functions to map chainId to chain and network
const getChainByChainId = (chainId: number): string => {
  switch (chainId) {
    case NEO_MAINNET_CHAIN_ID:
    case NEO_TESTNET_CHAIN_ID:
      return NEO_CHAIN;
    case POLYGON_MAINNET_CHAIN_ID:
    case POLYGON_TESTNET_CHAIN_ID:
      return POLYGON_CHAIN;
    default:
      return "";
  }
};

const getNetworkByChainId = (chainId: number): INetworkType => {
  switch (chainId) {
    case NEO_MAINNET_CHAIN_ID:
    case POLYGON_MAINNET_CHAIN_ID:
      return MAINNET;
    case NEO_TESTNET_CHAIN_ID:
    case POLYGON_TESTNET_CHAIN_ID:
      return TESTNET;
    default:
      return MAINNET;
  }
};

export const getTokenByHash = async (
  chain: CHAINS,
  network: INetworkType,
  hash: string
): Promise<ITokenState | undefined> => {
  if (TOKEN_LIST[chain][network][hash]) {
    return TOKEN_LIST[chain][network][hash];
  } else {
    try {
      return await globalRouter.fetchTokenInfo(chain, network, hash);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
};

export const findTradePaths = (
  tokenList,
  sourceToken: ITokenState,
  targetToken: ITokenState,
  maxDepth = 3
) => {
  const paths: ITokenState[][] = [];

  function dfs(currentToken: ITokenState, currentPath: ITokenState[], depth) {
    if (depth > maxDepth) return;

    if (currentToken === targetToken) {
      // @ts-ignore
      paths.push(currentPath);
      return;
    }
    const nextTokens =
      tokenList[currentToken.hash] && tokenList[currentToken.hash].pairs
        ? tokenList[currentToken.hash].pairs
        : [];
    for (const nextToken of nextTokens) {
      const _nextToken = tokenList[nextToken];
      if (!currentPath.includes(_nextToken)) {
        dfs(_nextToken, [...currentPath, _nextToken], depth + 1);
      }
    }
  }

  dfs(sourceToken, [sourceToken], 1);
  return paths;
};

export const parseAmount = (amount: string, decimals: number): BigNumber =>
  ethers.utils.parseUnits(amount, decimals);

export const calculateSlippage = (amount: BigNumber, slippage: number) =>
  amount.mul(ethers.BigNumber.from(Math.round(slippage * 100))).div(10000);

export const getCurrentStep = (state, steps) => {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (state[steps[i].key].success) return i + 1;
  }
  return 1;
};

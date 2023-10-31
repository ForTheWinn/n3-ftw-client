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
import { ethers } from "ethers";
import { fetchTokenInfo } from "./routers/global";

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
  console.log(hash)
  if (TOKEN_LIST[chain][network][hash]) {
    return TOKEN_LIST[chain][network][hash];
  } else {
    try {
      return await fetchTokenInfo(chain, network, hash);
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

export const parseAmount = (amount: string, decimals: number): bigint =>
  ethers.parseUnits(amount, decimals);

export const formatAmount = (
  amount: string,
  decimals: string | number
): string => {
  // Convert decimals to a number if it's a string
  const decimalsNumber =
    typeof decimals === "string" ? Number(decimals) : decimals;

  // Ensure decimalsNumber is a valid number before using it
  if (isNaN(decimalsNumber)) {
    throw new Error("Invalid decimals value");
  }
  return ethers.formatUnits(BigInt(amount), decimalsNumber).toString();
};
export const calculateSlippage = (amount: bigint, slippage: number) => {
  // Convert slippage to a BigInt representation
  const slippageBigInt = BigInt(Math.round(slippage * 100));

  // Calculate the slippage
  const calculatedAmount = (amount * slippageBigInt) / BigInt(10000);

  return calculatedAmount;
};

export const getCurrentStep = (state, steps) => {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (state[steps[i].key].success) return i + 1;
  }
  return 1;
};

export const transformString = (inputString: string | number): string => {
  const string =
    typeof inputString === "string" ? inputString : inputString.toString();
  const replacedString = string.replace(/,/g, ""); // Remove commas, if any

  // Convert replaced string to a number and format it correctly with commas and two decimals
  const numberFormat = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return numberFormat.format(Number(replacedString));
};

export const usdtABI = [
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_from", type: "address" },
      { indexed: true, name: "_to", type: "address" },
      { indexed: false, name: "_value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_owner", type: "address" },
      { indexed: true, name: "_spender", type: "address" },
      { indexed: false, name: "_value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
];

import {
  BASE_CHAIN,
  ETH_CHAIN,
  ETH_MAINNET_CHAIN_ID,
  ETH_TESTNET_CHAIN_ID,
  MAINNET,
  NEOX_CHAIN,
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
import { IToken } from "../consts/tokens";
import { EXPLORER_URLS } from "../consts/urls";
import { CHAINS, CONFIGS } from "../consts/chains";
import { ethers } from "ethers";
import { WENT_WRONG } from "../consts/messages";

export function createTokenMetadata({
  hash,
  symbol,
  decimals,
  icon = "",
  pairs = [],
  isWhitelisted = false,
  isNative = false,
  nativePair,
}: IToken) {
  return {
    hash,
    symbol,
    icon,
    decimals,
    pairs,
    isWhitelisted,
    isNative,
    nativePair,
  };
}

export const getExplorer = (
  chain: string,
  network: INetworkType,
  type: "tx" | "account" | "contract"
): string => {
  const explorerUrl = EXPLORER_URLS[chain]?.[network]?.[type];
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
    case ETH_MAINNET_CHAIN_ID:
    case ETH_TESTNET_CHAIN_ID:
      return ETH_CHAIN;
    default:
      return "";
  }
};

export const getChainIdByChain = (
  chain: CHAINS,
  network: INetworkType
): number => {
  switch (chain) {
    case NEO_CHAIN:
      return CONFIGS[network][NEO_CHAIN].chainId;
    case POLYGON_CHAIN:
      return CONFIGS[network][POLYGON_CHAIN].chainId;
    case ETH_CHAIN:
      return CONFIGS[network][ETH_CHAIN].chainId;
    case NEOX_CHAIN:
      return CONFIGS[network][NEOX_CHAIN].chainId;
    default:
      return 0;
  }
};

export const getChainNameByChain = (chain: CHAINS): string => {
  switch (chain) {
    case NEO_CHAIN:
      return "Neo";
    case POLYGON_CHAIN:
      return "Polygon";
    case ETH_CHAIN:
      return "Ethereum";
    case BASE_CHAIN:
      return "Base";
    default:
      return "";
  }
};

const getNetworkByChainId = (chainId: number): INetworkType => {
  switch (chainId) {
    case NEO_MAINNET_CHAIN_ID:
    case POLYGON_MAINNET_CHAIN_ID:
    case ETH_MAINNET_CHAIN_ID:
      return MAINNET;
    case NEO_TESTNET_CHAIN_ID:
    case POLYGON_TESTNET_CHAIN_ID:
    case ETH_TESTNET_CHAIN_ID:
      return TESTNET;
    default:
      return MAINNET;
  }
};

export const getTokenByHash = (
  chain: CHAINS,
  network: INetworkType,
  hash: string
): IToken | undefined => {
  const tokens: any = TOKEN_LIST[chain][network];
  let token: IToken | undefined = undefined;

  if (tokens) {
    tokens.forEach((t) => {
      if (t.hash.toLocaleLowerCase() === hash.toLocaleLowerCase()) {
        token = t;
      }
    });
  }

  if (token) {
    return token;
  } else {
    return undefined;
  }
};

export const findTradePaths = (
  chain: CHAINS,
  network: INetworkType,
  sourceToken: IToken,
  targetToken: IToken,
  maxDepth = 3
) => {
  const paths: IToken[][] = [];

  function dfs(currentToken: IToken, currentPath: IToken[], depth) {
    if (depth > maxDepth) return;

    if (currentToken === targetToken) {
      // @ts-ignore
      paths.push(currentPath);
      return;
    }
    const token = getTokenByHash(chain, network, currentToken.hash);

    const nextTokens =
      token && token.pairs && token.pairs.length > 0 ? token.pairs : [];

    for (const nextToken of nextTokens) {
      const _nextToken = getTokenByHash(chain, network, nextToken);
      if (_nextToken) {
        if (!currentPath.includes(_nextToken)) {
          dfs(_nextToken, [...currentPath, _nextToken], depth + 1);
        }
      }
    }
  }

  dfs(sourceToken, [sourceToken], 1);
  return paths;
};

export const formatAmount = (
  amount: string,
  decimals: string | number
): string => {
  const decimalsNumber = +decimals;

  if (isNaN(decimalsNumber)) {
    throw new Error("Invalid decimals value");
  }

  return ethers.formatUnits(BigInt(amount), decimalsNumber);
};

export const calculateSlippage = (amount: bigint, slippage: number) => {
  const slippageBigInt = BigInt(Math.round(slippage * 100));
  return (amount * slippageBigInt) / BigInt(10000);
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

export const extractErrorMessage = (error: any) => {
  if (error && typeof error.message === "string") {
    try {
      const errorMessageJSON = JSON.parse(error.message);
      if (errorMessageJSON && errorMessageJSON.message) {
        return errorMessageJSON.message;
      }
    } catch (parsingError) {
      console.error("Error parsing the error message:", parsingError);
      return WENT_WRONG;
    }
  }
  return WENT_WRONG;
};

export function convertChainForBackend(chain: CHAINS): string {
  switch (chain) {
    case NEO_CHAIN:
      return "neo";
    case ETH_CHAIN:
      return "ethereum";
    case POLYGON_CHAIN:
      return "polygon";
    default:
      throw new Error("Invalid chain");
  }
}

export const getWhitelistSwapTokens = (tokens: any) => {
  return Object.values(tokens).filter((token: any) => !!token.isWhitelisted);
};

export const getParamsFromBrowser = ():
  | { tokenA: string; tokenB: string }
  | undefined => {
  try {
    const href = window.location.href;
    // Find the start of the query string
    const queryStringStart = href.indexOf("?");

    // If there is a query string, extract and parse it; otherwise, params is an empty object
    const params: any =
      queryStringStart !== -1
        ? href
            .substring(queryStringStart + 1)
            .split("&")
            .reduce((acc, pair) => {
              const [key, value] = pair.split("=").map(decodeURIComponent);
              if (key) acc[key] = value; // Only add to acc if key is not empty
              return acc;
            }, {})
        : {};

    if (params && params.tokenA && params.tokenB) {
      return {
        tokenA: params.tokenA,
        tokenB: params.tokenB,
      };
    } else {
      return undefined;
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export function formatSignificantNumbers(input) {
  // Ensure the input is in string format to handle both numbers and strings
  let numStr = typeof input === "number" ? input.toString() : input;

  // Handling for numbers in scientific notation
  if (numStr.includes("e")) {
    let [base, exponent] = numStr.split("e");
    let decimalPlaces = Math.max(parseInt(exponent, 10), 0); // Ensure non-negative
    numStr = Number(numStr).toFixed(decimalPlaces + 2);
  }

  // Find leading zeros and decimal point
  const leadingZerosMatch = numStr.match(/^(0*\.0*)/);

  // If there are leading zeros followed by a decimal point, process further
  if (leadingZerosMatch) {
    const afterZeros = numStr.substring(leadingZerosMatch[0].length); // Get part of string after leading zeros and decimal
    const significantDigits = afterZeros.substring(0, 2); // Get first two significant digits
    return leadingZerosMatch[0] + significantDigits; // Combine leading zeros with first two significant digits
  } else {
    // For numbers without leading zeros (including integers and non-zero decimals), return up to two decimal places
    return Number(numStr).toFixed(2);
  }
}

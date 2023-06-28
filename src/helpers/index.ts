import { globalRouter } from "../common/routers";
import { CHAINS } from "../consts/chains";
import { MAINNET, NEO_CHAIN, POLYGON_CHAIN } from "../consts/global";
import { TOKEN_LIST } from "../consts/tokens";
import { INetworkType } from "../packages/neo/network";
import { ITokenState } from "../ui/pages/Swap/scenes/Swap/interfaces";

export const getChainId = (chain: string): number => {
  switch (chain) {
    case POLYGON_CHAIN:
      return 80001;
    default:
      return 1;
  }
};

export const getExploler = (chain: string, network: INetworkType): string => {
  switch (chain) {
    case NEO_CHAIN:
      if (network === MAINNET) {
        return "https://explorer.onegate.space/transactionInfo";
      } else {
        return "https://testmagnet.explorer.onegate.space/transactionInfo";
      }
    case POLYGON_CHAIN:
      if (network === MAINNET) {
        return "https://polygonscan.com/tx";
      } else {
        return "https://mumbai.polygonscan.com/tx";
      }
    default:
      return "";
  }
};

export const getExplolerForWallet = (
  chain: CHAINS,
  network: INetworkType
): string => {
  switch (chain) {
    case NEO_CHAIN:
      if (network === MAINNET) {
        return "https://explorer.onegate.space/accountprofile";
      } else {
        return "https://testmagnet.explorer.onegate.space/accountprofile";
      }
    case POLYGON_CHAIN:
      if (network === MAINNET) {
        return "https://polygonscan.com/address";
      } else {
        return "https://mumbai.polygonscan.com/address";
      }
    default:
      return "";
  }
};

export const getExplolerForContract = (
  chain: string,
  network: INetworkType
): string => {
  switch (chain) {
    case NEO_CHAIN:
      if (network === MAINNET) {
        return "https://explorer.onegate.space/contractinfo";
      } else {
        return "https://testmagnet.explorer.onegate.space/contractinfo";
      }
    case POLYGON_CHAIN:
      if (network === MAINNET) {
        return "https://polygonscan.com/token";
      } else {
        return "https://mumbai.polygonscan.com/token";
      }
    default:
      return "";
  }
};

export const getExplolerForContractByChainId = (chainId: number): string => {
  switch (chainId) {
    case 888:
      return "https://explorer.onegate.space/contractinfo";
    case 889:
      return "https://testmagnet.explorer.onegate.space/contractinfo";
    case 137:
      return "https://polygonscan.com/token";
    case 80001:
      return "https://mumbai.polygonscan.com/token";

    default:
      return "";
  }
};

export const getExplolerForTxByChainId = (chainId: number): string => {
  switch (chainId) {
    case 888:
      return "https://explorer.onegate.space/transactionInfo";
    case 889:
      return "https://testmagnet.explorer.onegate.space/transactionInfo";
    case 137:
      return "https://polygonscan.com/tx";
    case 80001:
      return "https://mumbai.polygonscan.com/tx";

    default:
      return "";
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

    // return await globalRouter.fetchTokenInfo(chain, network, hash);
  }
};

export const getLPEstimate = (
  amount: number,
  reserveAmount: string,
  opponentReserveAmount: string
): string => {
  let estimated =
    (amount * parseFloat(reserveAmount)) / parseFloat(opponentReserveAmount);

  return estimated.toString();
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

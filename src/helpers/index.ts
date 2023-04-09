import { globalRouter } from "../common/routers";
import { CHAINS } from "../consts/chains";
import { NEO_CHAIN, POLYGON_CHAIN } from "../consts/chains";
import { MAINNET } from "../consts/global";
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

// export const getTokenByHash = (
//   chain: CHAINS,
//   network: INetworkType,
//   hash: string
// ): ITokenState | undefined => {
//   const result = TOKENS.SWAP_TOKEN_LIST[chain][network].find(
//     (token) => token.hash === hash
//   );
//   if (result) {
//     return result;
//   }
//   return undefined;
// };

export const getTokenByHash = (
  chain: CHAINS,
  network: INetworkType,
  hash: string
): ITokenState | undefined => {
  if (TOKEN_LIST[chain][network][hash]) {
    return TOKEN_LIST[chain][network][hash];
  } else {
    return undefined;
    // return await globalRouter.fetchTokenInfo(chain, network, hash);
  }
};

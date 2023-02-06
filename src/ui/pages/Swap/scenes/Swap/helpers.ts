import { NEO_SCRIPT_HASH } from "../../../../../packages/neo/consts/nep17-list";
import { POLYGON_TOKENS } from "../../../../../packages/polygon";
import { ITokenState } from "./interfaces";

export const priceImpactFormat = (p: number) => {
  if (p < 0.01) {
    return "<0.01%";
  } else {
    return p.toFixed(2) + "%";
  }
};

export const getTokenByHash = (list: ITokenState[], hash: string): ITokenState | undefined => {
  const result = POLYGON_TOKENS.find((token) => token.hash === hash);
  if (result) {
    return result;
  }
  return undefined;
};

export const fakeNEOBNEOReserve = (
  bNEOHash: string,
  balances: { neo: number; bNEO: number }
) => {
  return {
    pair: {
      [NEO_SCRIPT_HASH]: {
        symbol: "NEO",
        decimals: 0,
        reserveAmount: 9999999999,
      },
      [bNEOHash]: {
        symbol: "bNEO",
        decimals: 8,
        reserveAmount: 999999999900000000,
      },
    },
    userBalances: {
      [NEO_SCRIPT_HASH]: balances.neo,
      [bNEOHash]: balances.bNEO,
    },
    totalShare: 99999999,
  };
};

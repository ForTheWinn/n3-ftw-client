import { u } from "@cityofzion/neon-core";
import { NEO_SCRIPT_HASH } from "../../../../../packages/neo/consts/neo-contracts";

export const priceImpactFormat = (p: number) => {
  if (p < 0.01) {
    return "<0.01%";
  } else {
    return p.toFixed(2) + "%";
  }
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
        reserveAmountFormatted: "9999999999",
        reserve: u.BigInteger.fromNumber(9999999999)
      },
      [bNEOHash]: {
        symbol: "bNEO",
        decimals: 8,
        reserveAmount: 999999999900000000,
        reserveAmountFormatted: "999999999900000000",
        reserve: u.BigInteger.fromNumber(999999999900000000)
      }
    },
    userBalances: {
      [NEO_SCRIPT_HASH]: balances.neo,
      [bNEOHash]: balances.bNEO
    },
    totalShare: 99999999
  };
};

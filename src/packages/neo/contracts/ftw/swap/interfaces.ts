import { u } from "@cityofzion/neon-core";

export interface IReserveData {
  pair: {
    [key: string]: {
      symbol: string;
      decimals: number;
      reserveAmount: number;
      reserveAmountFormatted: string;
      reserve: u.BigInteger;
    };
  };
  userBalances: {
    [key: string]: number;
  };
  totalShare: number;
}

export interface ISwapsHistory {
  totalItems: number;
  totalPages: number;
  items: ISwap[];
  pair: {
    [key: string]: {
      symbol: string;
      decimals: number;
    };
  };
}

export interface ILPHistory {
  totalItems: number;
  totalPages: number;
  items: ILPToken[];
  pair: {
    [key: string]: {
      symbol: string;
      decimals: number;
    };
  };
}
//
// export interface IPairInfo {
//   reserve: IReserve;
//   pair: Balance;
//   balances: Balance;
// }
//
// interface Balance {
//   [key: string]: number;
// }

// export interface ILPTokens {
//   name: string;
//   tokenId: string;
//   lockUntil: string;
//   amount: number;
// }

export interface IReserve {
  tokenA: string;
  tokenB: string;
  amountA: number;
  amountB: number;
  totalShare: number;
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenADecimals: number;
  tokenBDecimals: number;
}

export interface ISwap {
  owner: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  createdAt: string;
}

export interface ILPToken {
  id: string;
  amount: number;
  name: string;
  owner: string;
  lock: string;
  tokenId: string;
  createdAt: string;
  tokenA: string;
  tokenB: string;
  symbolA: string;
  symbolB: string;
}

// For verification
export interface IContractInfo {
  contractHash: string;
  symbol: string;
  decimals: number;
  isWhitelisted: boolean;
}

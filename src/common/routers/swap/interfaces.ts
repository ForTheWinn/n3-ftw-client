export interface IUserTokenBalances {
  amountA: string;
  amountB: string;
}

export interface ISwapReserves {
  reserveA: string;
  reserveB: string;
  shares: string;
}

export interface ISwapLPToken {
  tokenId: string;
  tokenA: string;
  tokenB: string;
  symbolA: string;
  symbolB: string;
  amountA: string;
  amountB: string;
  decimalsA: string;
  decimalsB: string;
  sharesPercentage: string;
  lock?: number;
  image?: string;
}

export interface ISwapEstimateArgs {
  tokenA: string;
  tokenB: string;
  amount: string;
  isReverse: boolean;
}

export interface IUserTokenBalances {
  amountA: string;
  amountB: string;
}

export interface ISwapReserves {
  reserveA: string;
  reserveB: string;
  shares: string;
}

export interface ISwapEstimateArgs {
  tokenA: string;
  tokenB: string;
  amount: string;
  isReverse: boolean;
}

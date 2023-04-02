export interface ITokenBalances {
  amountA: string;
  amountB: string;
}

export interface SwapEstimateArgs {
  tokenA: string;
  tokenB: string;
  amount: string;
  isReverse: boolean;
}

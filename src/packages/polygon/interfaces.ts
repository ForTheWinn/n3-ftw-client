export interface ILPTokenURI {
  name: string;
  shares: string;
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  symbolA: string;
  symbolB: string;
  decimalsA: string;
  decimalsB: string;
}

export interface SwapEstimateArgs {
  tokenA: string;
  tokenB: string;
  amount: string;
  isReverse: boolean;
}

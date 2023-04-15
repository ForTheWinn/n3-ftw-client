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

export interface SwapArgs {
  tokenA: string;
  tokenB: string;
  amountIn: string;
  amountOut: string;
  isReverse: boolean;
}

export interface AddLiquidityArgs {
  tokenA: string;
  amountA: string;
  tokenB: string;
  amountB: string;
  slippage: number;
}

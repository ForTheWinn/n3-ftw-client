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
  amountIn: bigint;
  amountOut: bigint;
  isReverse: boolean;
}

export interface AddLiquidityArgs {
  tokenA: string;
  amountA: string;
  tokenB: string;
  amountB: string;
  slippage: number;
}

export interface ISmithTokenInfo {
  owner: string;
  contractHash: string;
  name: string;
  symbol: string;
  website?: string;
  icon?: string;
}

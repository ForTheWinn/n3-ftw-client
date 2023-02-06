export interface ITokenState {
  hash: string;
  decimals: number;
  symbol: string;
  icon: string;
}

export interface IReservesState {
  reserveA: string;
  reserveB: string;
  shares: string;
}

export interface IBalancesState {
  amountA: string,
  amountB: string
}

export interface ISwapInputState {
  type: "A" | "B";
  value?: number;
}

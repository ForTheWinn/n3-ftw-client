export interface ITokenState {
  hash: string;
  decimals: number;
  symbol: string;
  icon: string;
}

export interface ISwapInputState {
  type: "A" | "B";
  value?: number;
}

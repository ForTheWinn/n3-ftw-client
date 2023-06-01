export interface IBridgeSelectedtoken {
  originHash: string;
  destHash: string;
  symbol: string;
  icon: string;
  decimals: number;
}

export interface IBridgeReceiver {
  address: string;
  isValid: boolean;
}
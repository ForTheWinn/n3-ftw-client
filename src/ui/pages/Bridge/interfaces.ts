import { IToken } from "../../../consts/tokens";

export interface IBridgeSelectedtoken {
  hash: string;
  symbol: string;
  icon: string;
  decimals: number;
  destToken: IToken;
}

export interface IBridgeReceiver {
  address: string;
  isValid: boolean;
}

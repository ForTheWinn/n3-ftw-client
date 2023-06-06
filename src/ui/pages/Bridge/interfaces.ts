import { ITokenState } from "../Swap/scenes/Swap/interfaces";

export interface IBridgeSelectedtoken {
  hash: string;
  symbol: string;
  icon: string;
  decimals: number;
  destToken: ITokenState;
}

export interface IBridgeReceiver {
  address: string;
  isValid: boolean;
}

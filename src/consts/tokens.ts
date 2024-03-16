import { NEO_TOKENS } from "../packages/neo/consts/tokens";
import { EVM_TOKENS } from "../packages/evm";

export interface IToken {
  hash: string;
  symbol: string;
  decimals: number;
  icon?: string;
  totalSupply?: string;
  pairs?: string[];
  isWhitelisted?: boolean;
  isNative?: boolean;
  nativePair?: {
    hash: string;
    symbol: string;
    decimals: number;
  };
}

export const TOKEN_LIST = {
  ...NEO_TOKENS,
  ...EVM_TOKENS,
};

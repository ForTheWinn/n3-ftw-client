import { NEP_LOGO } from "../neo/contracts/ftw/farm/consts";

interface IToken {
  hash: string;
  decimals: number;
  symbol: string;
  icon: string;
}

export const POLYGON_TOKENS: IToken[] = [
  {
    hash: "0x5fD762EED8228f2dc83E129713888bcD0fDc2376",
    decimals: 8,
    symbol: "NEP",
    icon: NEP_LOGO,
  },
  {
    hash: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
    decimals: 18,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
  },
];

export const POLYGON_SWAP_CONTRACT_HASH = "0x86AbEba73A0Cc9d457614DCFB14398306c440D63";

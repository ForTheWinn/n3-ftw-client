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
    symbol: "DERC",
    icon: "/symbols/unknown.png",
  },
];

export const POLYGON_SWAP_CONTRACT_HASH = "0x5dC9AD300D264C5422D47fdbB2802F4b9Ee2ac48";
// export const POLYGON_SWAP_CONTRACT_HASH = "0xd668a3Cb94d526E372d83C7228F9E91e9a240F73";

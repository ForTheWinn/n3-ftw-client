export interface ISmithTokenProps {
  owner: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  website?: string;
  icon?: string
}

export interface ISmithTokenDataProps {
  items: ISmithTokenProps[];
  totalPages: number;
}

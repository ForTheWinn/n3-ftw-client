export interface IPrices {
  [key: string]: number;
}
export interface IPrice {
	price: number
}

export interface ISwapHistoryResult {
  items: ISwap[];
  totalItems: number;
  perPage: number;
  totalPages: number;
}

interface ISwap {
  account: string;
  base_id: string;
  base_amount: number;
  quote_id: string;
  quote_amount: number;
  fee: number;
  blockIndex: number;
  vmstate: string;
  time: number;
  txid: string;
}

export interface IToken {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
  blockIndex: number;
  vmstate: string;
  time: number;
  txid: string;
}

export interface IPair {
	id: string;
	token_A_id: string;
	token_A_name: string;
	token_A_symbol: string;
	token_A_decimals: number;
	token_B_id: string;
	token_B_name: string;
	token_B_symbol: string;
	token_B_decimals: number;
	blockIndex: number;
	vmstate: string;
	time: number;
	txid: string;
}

export interface ITokenWithNumbers {
  id: string;
  name: string;
  decimals: number;
  tradeVolume: number;
  tradeVolumeUSD: number;
  totalLiquidity: number;
  totalLiquidityUSD: number;
  price: number;
}


export interface IPairWithNumbers {
	id: string;
	tokenA: {
		id: string;
		symbol: string;
		decimals: number;
		price: number;
	};
	tokenB: {
		id: string;
		symbol: string;
		decimals: number;
		price: number;
	};
	reserve0: number;
	reserve1: number;
	reserveUSD: number;
	volumeToken0: number;
	volumeToken1: number;
	volumeUSD: number;
	feesUSD: number;
	createdAtTimestamp: number;
	createdAtBlockNumber: number;
}

export interface ILiquidityWithTimeRange{
	labels: string[],
	data: number[],
}

export interface INEPInfoWithTimeRange{
	labels: string[],
	prices: number[],
	liquidity: number[],
}

export interface IPairDay{
	id: string;
	date: string;
	tokenA: {
		id: string;
		symbol: string;
		decimals: number;
		price: number;
	};
	tokenB: {
		id: string;
		symbol: string;
		decimals: number;
		price: number;
	};
	reserve0: number;
	reserve1: number;
	reserveUSD: number;
	dailyVolumeToken0: number;
	dailyVolumeToken1: number;
	dailyVolumeUSD: number;
	dailyFeesUSD: number;
}

export interface IRuneProperties {
	_id: string;
	tokenId: number;
	name: string;
	phase: string;
	image: string;
	luck: string;
}

export interface IBoyProperties {
	_id: string;
	no: number;
	name: string;
	attributes: object;
	image: string;
}

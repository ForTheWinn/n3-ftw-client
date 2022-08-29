import { INetworkType } from "../network";
import { ENDPOINT } from "./consts";
import {
	ILiquidityWithTimeRange, INEPInfoWithTimeRange,
	IPair, IPairDay,
	IPairWithNumbers, IPrice, IPrices,
	IRuneProperties,
	ISwapHistoryResult,
	IToken,
	ITokenWithNumbers
} from "./interfaces";

export class RestAPI {
  network: INetworkType;
  endpoint: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.endpoint = ENDPOINT[networkType];
  }

  fetchResult = async (url: string) => {
    const res = await fetch(url, { mode: "cors" });
    const json = await res.json();
    if (res.status === 200) {
      return json;
    } else {
      // throw new Error(json.message);
      throw new Error("Network error");
    }
  };

  async getRunes(filter): Promise<IRuneProperties[]> {
    return this.fetchResult(this.endpoint + "/runes/" + filter);
  }

  async getRune(tokenId): Promise<IRuneProperties> {
    return this.fetchResult(this.endpoint + "/rune/" + tokenId);
  }

  async getTokens(): Promise<IToken[]> {
    return this.fetchResult(this.endpoint + "/tokens");
  }

  async getToken(id): Promise<ITokenWithNumbers> {
    return this.fetchResult(this.endpoint + "/tokens/" + id);
  }

  async getFarms() {
    return this.fetchResult(this.endpoint + "/farms");
  }

	async getPrice(id): Promise<IPrice> {
		console.log(id)
		return this.fetchResult(this.endpoint + `/prices/${id}`);
	}

  async getPrices(): Promise<IPrices> {
    return this.fetchResult(this.endpoint + "/prices");
  }

  async getLiquidity(id, days): Promise<ILiquidityWithTimeRange> {
    return this.fetchResult(this.endpoint + `/tokens/liquidity/${id}/${days}`);
  }

  async getNEP(days): Promise<INEPInfoWithTimeRange> {
    return this.fetchResult(this.endpoint + `/nep/${days}`);
  }

	async getNumbersWithRange(id, days): Promise<INEPInfoWithTimeRange> {
		return this.fetchResult(this.endpoint + `/tokens/numbers/${id}/${days}`);
	}

  async getPairs(): Promise<IPair[]> {
    return this.fetchResult(this.endpoint + "/pairs");
  }

  async getPair(id): Promise<IPairWithNumbers> {
    return this.fetchResult(this.endpoint + "/pairs/" + id);
  }

  async getPairDay(id): Promise<IPairDay> {
    return this.fetchResult(this.endpoint + "/pairs/" + id + "/day");
  }

  async getSwapHistory(tokenA, tokenB, page): Promise<ISwapHistoryResult> {
    return this.fetchResult(
      this.endpoint + `/pairs/history/swap/${tokenA}/${tokenB}/${page}`
    );
  }

	async getSingleSwapHistory(tokenId, page): Promise<ISwapHistoryResult> {
		return this.fetchResult(
			this.endpoint + `/tokens/swap/${tokenId}/${page}`
		);
	}
}

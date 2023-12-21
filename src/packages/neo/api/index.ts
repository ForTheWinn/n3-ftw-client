import { MAINNET, TESTNET } from "../../../consts/global";
import { LOCKER_SCRIPT_HASH } from "../contracts/ftw/locker/consts";
import { INetworkType } from "../network";
import {
  IEVMPair,
  ILiquidityWithTimeRange,
  INEPInfoWithTimeRange,
  IPair,
  IPairDay,
  IPairWithNumbers,
  IPrice,
  IPrices,
  IRuneProperties,
  ISwapHistoryResult,
  IToken,
  ITokenWithNumbers,
} from "./interfaces";
import { CHAINS } from "../../../consts/chains";
import { convertChainForBackend } from "../../../common/helpers";

export const ENDPOINT = {
  [TESTNET]: "https://api.forthewin.network/mainnet",
  [MAINNET]: "https://api.forthewin.network/mainnet",
};

const BASE_URL_GHOSTMARKET = "https://api.ghostmarket.io/api/v2";

export class RestAPI {
  network: INetworkType;
  endpoint: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.endpoint = ENDPOINT[networkType];
  }

  buildURL = (path: string) => `${this.endpoint}${path}`;

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
    return this.fetchResult(this.buildURL(`/runes/${filter}`));
  }

  async getRune(tokenId): Promise<IRuneProperties> {
    return this.fetchResult(this.buildURL(`/rune/${tokenId}`));
  }

  async getTokens(): Promise<IToken[]> {
    return this.fetchResult(this.buildURL(`/tokens`));
  }

  async getToken(id): Promise<ITokenWithNumbers> {
    return this.fetchResult(this.buildURL(`/tokens/${id}`));
  }

  async getFarms() {
    return this.fetchResult(this.buildURL(`/farms`));
  }

  async getPrice(id): Promise<IPrice> {
    return this.fetchResult(this.buildURL(`/prices/${id}`));
  }

  async getPrices(): Promise<IPrices> {
    return this.fetchResult(this.buildURL(`/prices`));
  }

  async getPricesRange(tokenId): Promise<IPrices> {
    return this.fetchResult(this.buildURL(`/prices/${tokenId}/range`));
  }

  async getLiquidity(id, days): Promise<ILiquidityWithTimeRange> {
    return this.fetchResult(this.buildURL(`/tokens/liquidity/${id}/${days}`));
  }

  async getNumbersWithRange(id, days): Promise<INEPInfoWithTimeRange> {
    return this.fetchResult(this.buildURL(`/tokens/numbers/${id}/${days}`));
  }

  async getPairs(): Promise<IPair[]> {
    return this.fetchResult(this.buildURL(`/pairs`));
  }

  async getPair(id): Promise<IPairWithNumbers> {
    return this.fetchResult(this.buildURL(`/pairs/${id}`));
  }

  async getPairDay(id): Promise<IPairDay> {
    return this.fetchResult(this.buildURL(`/pairs/${id}/day`));
  }

  async getSwapHistory(tokenA, tokenB, page): Promise<ISwapHistoryResult> {
    return this.fetchResult(
      this.buildURL(`/pairs/history/swap/${tokenA}/${tokenB}/${page}`)
    );
  }

  async getSingleSwapHistory(tokenId, page): Promise<ISwapHistoryResult> {
    return this.fetchResult(this.buildURL(`/tokens/swap/${tokenId}/${page}`));
  }

  async getBoyz(filter): Promise<ISwapHistoryResult> {
    const params = "?" + new URLSearchParams(filter).toString();
    return this.fetchResult(this.buildURL(`/boyz/all${params}`));
  }

  async getBoy(no: string | number): Promise<ISwapHistoryResult> {
    return this.fetchResult(this.buildURL(`/boyz/${no}`));
  }

  async getGMAssets(filter): Promise<any> {
    const defaultFilters = {
      collection: "ftw-locker",
      "addressesChains[]": "n3",
      listingState: "OnSaleNotExpired",
      ...filter,
    };
    const params = "?" + new URLSearchParams(defaultFilters).toString();
    const res = await this.fetchResult(
      `${BASE_URL_GHOSTMARKET}/assets${params}`
    );

    if (res.next) {
      defaultFilters.Cursor = res.next;
      const params = "?" + new URLSearchParams(defaultFilters).toString();
      const res1 = await this.fetchResult(
        `${BASE_URL_GHOSTMARKET}/assets${params}`
      );
      res.assets = res.assets.concat(res1.assets);
    }
    return res;
  }

  async getGMEvents(filter): Promise<any> {
    const defaultFilters = {
      collection: "ftw-locker",
      "addressesChains[]": "n3",
      ...filter,
    };

    const params = "?" + new URLSearchParams(defaultFilters).toString();
    return this.fetchResult(`${BASE_URL_GHOSTMARKET}/events${params}`);
  }

  async getGMOrders(filter): Promise<any> {
    const defaultFilters = {
      chain: "n3",
      contract: LOCKER_SCRIPT_HASH[this.network],
      ...filter,
    };

    const params = "?" + new URLSearchParams(defaultFilters).toString();
    return this.fetchResult(`${BASE_URL_GHOSTMARKET}/asset/orders${params}`);
  }

  async getEVMSwapPairs({ chain }: { chain: CHAINS }): Promise<IEVMPair> {
    return this.fetchResult(
      this.buildURL(`/evm/pairs/${convertChainForBackend(chain)}`)
    );
  }

}

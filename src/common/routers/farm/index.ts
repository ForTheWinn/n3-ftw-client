import {
  CHAINS,
  NEO_CHAIN,
  POLYGON_CHAIN
} from "../../../packages/chains/consts";
import { RestAPI } from "../../../packages/neo/api";
import { IPrices } from "../../../packages/neo/api/interfaces";
import { MAINNET } from "../../../packages/neo/consts";
import { SwapContract } from "../../../packages/neo/contracts";
import { FarmV2Contract } from "../../../packages/neo/contracts/ftw/farm-v2";
import { IPoolEnhanced } from "../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { IReserveData } from "../../../packages/neo/contracts/ftw/swap/interfaces";
import { INetworkType } from "../../../packages/neo/network";
import { withDecimal } from "../../../packages/neo/utils";
import { getPools, stake } from "../../../packages/polygon/farm";
import {
  getLPTokens as getPolygonLPTokens,
  getReserve as getPolygonReserves
} from "../../../packages/polygon/swap";
import { IFarmLPToken } from "./interfaces";

export const getPrices = (chain: CHAINS): Promise<IPrices> => {
  switch (chain) {
    case NEO_CHAIN:
      return new RestAPI(MAINNET).getPrices();
    case POLYGON_CHAIN:
      return new RestAPI(MAINNET).getPrices();
  }
};

export const getPoolList = (
  chain: CHAINS,
  network: INetworkType
): Promise<IPoolEnhanced[]> => {
  switch (chain) {
    case NEO_CHAIN:
      return new FarmV2Contract(network).getPools(chain);
    case POLYGON_CHAIN:
      return getPools();
  }
};

// TODO: double check for optimize
export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<IReserveData> => {
  switch (chain) {
    case NEO_CHAIN:
      return new SwapContract(network).getReserve(tokenA, tokenB);
    case POLYGON_CHAIN:
      const res = await getPolygonReserves(tokenA, tokenB);
      return {
        pair: {
          [tokenA]: {
            symbol: "",
            decimals: 8,
            reserveAmount: parseFloat(res.reserveA),
            reserveAmountFormatted: withDecimal(res.reserveA, 8)
          },
          [tokenB]: {
            symbol: "",
            decimals: 18,
            reserveAmount: parseFloat(res.reserveB),
            reserveAmountFormatted: withDecimal(res.reserveB, 18)
          }
        },
        userBalances: {},
        totalShare: parseFloat(res.shares)
      };
  }
};

export const getLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  address: string
): Promise<IFarmLPToken[]> => {
  switch (chain) {
    case NEO_CHAIN:
      const tokens: IFarmLPToken[] = [];
      const res = await new SwapContract(network).getLPTokens(address);
      for (const token of res) {
        const reserves = await new SwapContract(network).getReserve(
          token.tokenA,
          token.tokenB
        );
        tokens.push({
          name: token.name,
          tokenA: token.tokenA,
          tokenB: token.tokenB,
          tokenId: token.tokenId,
          tokenAAmount: reserves.pair[token.tokenA].reserveAmountFormatted,
          tokenBAmount: reserves.pair[token.tokenB].reserveAmountFormatted,
          sharesPercentage: (
            (token.amount / reserves.totalShare) *
            100
          ).toFixed(2)
        });
      }
      return tokens;
    case POLYGON_CHAIN:
      return getPolygonLPTokens(address);
  }
};

export const stakeLPToken = (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
) => {
  switch (chain) {
    case NEO_CHAIN:
      stake(tokenId);
      break;
    case POLYGON_CHAIN:
      stake(tokenId);
      break;
  }
};

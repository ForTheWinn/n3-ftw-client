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
import { getPools } from "../../../packages/polygon/farm";

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

export const getReserves = (
  chain: CHAINS,
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<IReserveData> => {
  switch (chain) {
    case NEO_CHAIN:
      return new SwapContract(network).getReserve(tokenA, tokenB);
    case POLYGON_CHAIN:
      return new SwapContract(network).getReserve(tokenA, tokenB);
  }
};

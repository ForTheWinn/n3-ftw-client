import {
  CHAINS,
  NEO_CHAIN,
  POLYGON_CHAIN,
} from "../../../packages/chains/consts";
import { RestAPI } from "../../../packages/neo/api";
import { IPrices } from "../../../packages/neo/api/interfaces";
import { MAINNET } from "../../../packages/neo/consts";
import { FarmV2Contract } from "../../../packages/neo/contracts/ftw/farm-v2";
import { IPool } from "../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { INetworkType } from "../../../packages/neo/network";

export const getPrices = (chain: CHAINS): Promise<IPrices> => {
  switch (chain) {
    case NEO_CHAIN:
      return new RestAPI(MAINNET).getPrices();
    case POLYGON_CHAIN:
      return new RestAPI(MAINNET).getPrices();
  }
};

export const getPoolList = (chain: CHAINS, network: INetworkType): Promise<IPool[]> => {
  switch (chain) {
    case NEO_CHAIN:
      return new FarmV2Contract(network).getPools();
    case POLYGON_CHAIN:
      return new FarmV2Contract(network).getPools();
  }
};

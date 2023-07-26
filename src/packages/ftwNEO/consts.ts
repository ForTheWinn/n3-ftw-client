import {
  MAINNET,
  POLYGON_MAINNET_CHAIN_ID,
  POLYGON_TESTNET_CHAIN_ID,
  TESTNET,
} from "../../consts/global";
import { POLYGON_MAINNET_FNEO_CONTRACT_ADDRESSES } from "../polygon/consts";

const polygonFNEO = {
  name: "Polygon ftwNEO",
  address: POLYGON_MAINNET_FNEO_CONTRACT_ADDRESSES,
  chainId: {
    [MAINNET]: POLYGON_MAINNET_CHAIN_ID,
    [TESTNET]: POLYGON_TESTNET_CHAIN_ID,
  },
  perBlock: {
    [MAINNET]: 1,
    [TESTNET]: 1,
  },
};

export const NEP_PER_BLOCK = {
  [MAINNET]: {
    [POLYGON_MAINNET_CHAIN_ID]: 5,
  },
  [TESTNET]: {
    [POLYGON_TESTNET_CHAIN_ID]: 5,
  },
};

export const FNEO_CHAINS = [polygonFNEO];

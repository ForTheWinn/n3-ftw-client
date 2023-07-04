import { MAINNET, TESTNET } from "../../consts/global";
import { FNEO_SCRIPT_HASHES } from "../polygon/consts";

const polygonFNEO = {
  name: "Polygon ftwNEO",
  address: FNEO_SCRIPT_HASHES,
  chainId: {
    [MAINNET]: 137,
    [TESTNET]: 80001,
  },
  perBlock: {
    [MAINNET]: 1,
    [TESTNET]: 1,
  },
};

export const NEP_PER_BLOCK = {
  [MAINNET]: {
    80001: 5,
  },
  [TESTNET]: {
    80001: 5,
  },
};

export const FNEO_CHAINS = [polygonFNEO];

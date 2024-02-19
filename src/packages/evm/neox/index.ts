import { NEOX_TESTNET_CONTRACTS } from "./testnet";
import { NEOX_MAINNET_CONTRACTS } from "./mainnet";

import { MAINNET, TESTNET, SMITH } from "../../../consts/global";

export const NEOX_NEP_CONTRACT_ADDRESSES = {
  [MAINNET]: NEOX_MAINNET_CONTRACTS.NEP,
  [TESTNET]: NEOX_TESTNET_CONTRACTS.NEP,
};

export const NEOX_CONTRACT_MAP = {
  [MAINNET]: {
    [SMITH]: NEOX_MAINNET_CONTRACTS.SMITH,
  },
  [TESTNET]: {
    [SMITH]: NEOX_TESTNET_CONTRACTS.SMITH,
  },
};

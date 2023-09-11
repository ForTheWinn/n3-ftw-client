import { BRIDGE, FARM, MAINNET, SMITH, SWAP, TESTNET } from "../../consts/global";

export const ETH_CONTRACT_MAP = {
  [MAINNET]: {
    [SWAP]: "0x2055EBeDa360Ad8FF035cdbA506dC1fADcC49a94",
    [FARM]: "",
    [BRIDGE]: "",
    [SMITH]: "",
  },
  [TESTNET]: {
    [SWAP]: "",
    [FARM]: "",
    [BRIDGE]: "",
    [SMITH]: "",
  },
};

export const ETH_SWAP_TOKENS_MAP = {
  [MAINNET]: [],
  [TESTNET]: [],
};
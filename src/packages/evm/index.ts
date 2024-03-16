import { ETH_CHAIN, NEOX_CHAIN, POLYGON_CHAIN } from "../../consts/global";
import { ETHEREUM_CONTRACTS, ETH_FNEO } from "./ethereum";
import { ETHEREUM_TOKENS } from "./ethereum/tokens";
import { NEOX_CONTRACTS } from "./neox";
import { NEOX_TOKENS } from "./neox/tokens";
import { POLYGON_CONTRACTS, POLYGON_FNEO } from "./polygon";
import { POLYGON_TOKENS } from "./polygon/tokens";

export const EVM_CONTRACTS = {
  [POLYGON_CHAIN]: POLYGON_CONTRACTS,
  [ETH_CHAIN]: ETHEREUM_CONTRACTS,
  [NEOX_CHAIN]: NEOX_CONTRACTS,
};

export const EVM_TOKENS = {
  [POLYGON_CHAIN]: POLYGON_TOKENS,
  [ETH_CHAIN]: ETHEREUM_TOKENS,
  [NEOX_CHAIN]: NEOX_TOKENS,
};

export const EVM_FNEO_MAP = {
  [ETH_CHAIN]: ETH_FNEO,
  [POLYGON_CHAIN]: POLYGON_FNEO,
};

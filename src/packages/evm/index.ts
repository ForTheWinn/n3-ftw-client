import { ETH_CHAIN, NEOX_CHAIN, POLYGON_CHAIN } from "../../consts/global";
import {
  ETHEREUM_CONTRACT_MAP,
  ETHEREUM_TOKENS_METADATA_MAP,
  ETH_FNEO,
} from "./ethereum";
import { NEOX_CONTRACT_MAP } from "./neox";
import {
  POLYGON_CONTRACT_MAP,
  POLYGON_TOKENS_METADATA_MAP,
  POLYGON_FNEO,
} from "./polygon";

export const EVM_CONTRACT_MAP = {
  [POLYGON_CHAIN]: POLYGON_CONTRACT_MAP,
  [ETH_CHAIN]: ETHEREUM_CONTRACT_MAP,
  [NEOX_CHAIN]: NEOX_CONTRACT_MAP,
};

export const EVM_TOKEN_LIST = {
  [POLYGON_CHAIN]: POLYGON_TOKENS_METADATA_MAP,
  [ETH_CHAIN]: ETHEREUM_TOKENS_METADATA_MAP,
};

export const EVM_FNEO_MAP = {
  [ETH_CHAIN]: ETH_FNEO,
  [POLYGON_CHAIN]: POLYGON_FNEO,
};

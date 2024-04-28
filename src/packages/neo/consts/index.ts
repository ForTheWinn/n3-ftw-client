import { MAINNET, SWAP, FARM, TESTNET, SMITH } from "../../../consts/global";
import { FARM_V2_SCRIPT_HASH } from "../contracts/ftw/farm-v2/consts";
import { SMITH_SCRIPT_HASH } from "../contracts/ftw/smith/consts";
import { SWAP_SCRIPT_HASH } from "../contracts/ftw/swap/consts";

export const O3 = "O3";
export const NEON = "NEON";
export const NEO_LINE = "NEO_LINE";
export const NEO_LINE_MOBILE = "NEO_LINE_MOBILE";
export const ONE_GATE = "ONE_GATE";

export const MAINNET_CONFIG = {
  label: "N3MainNet",
  url: "http://seed1.neo.org:10332",
};

export const TESTNET_CONFIG = {
  label: "N3TestNet",
  url: "https://us-central1-ez-router.cloudfunctions.net/route/seed1t5.neo.org:20332",
};


export const CONTRACT_LIST = {
  [MAINNET]: {
    [SWAP]: SWAP_SCRIPT_HASH[MAINNET],
    [FARM]: FARM_V2_SCRIPT_HASH[MAINNET],
    [SMITH]: SMITH_SCRIPT_HASH[MAINNET],
  },
  [TESTNET]: {
    [SWAP]: SWAP_SCRIPT_HASH[TESTNET],
    [FARM]: FARM_V2_SCRIPT_HASH[TESTNET],
    [SMITH]: SMITH_SCRIPT_HASH[TESTNET],
  },
};

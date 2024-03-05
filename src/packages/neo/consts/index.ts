import { MAINNET, SWAP, FARM, TESTNET, SMITH } from "../../../consts/global";
import { FARM_V2_SCRIPT_HASH } from "../contracts/ftw/farm-v2/consts";
import { SMITH_SCRIPT_HASH } from "../contracts/ftw/smith/consts";
import { SWAP_SCRIPT_HASH } from "../contracts/ftw/swap/consts";
import { NEO_MAINNET_TOKENS, NEO_TESTNET_TOKENS } from "./tokens";

export const O3 = "O3";
export const NEON = "NEON";
export const NEO_LINE = "NEO_LINE";
export const NEO_LINE_MOBILE = "NEO_LINE_MOBILE";
export const ONE_GATE = "ONE_GATE";

export const MAINNET_CONFIG = {
  label: "N3MainNet",
  url: "https://mainnet1.neo.coz.io:443",
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

export const NEO_TOKENS = {
  [MAINNET]: NEO_MAINNET_TOKENS,
  [TESTNET]: NEO_TESTNET_TOKENS,
};

const getWhitelistSwapTokens = (tokens: any) => {
  return Object.values(tokens).filter((token: any) => !!token.isWhitelisted);
};

export const NEO_SWAP_TOKENS = {
  [MAINNET]: getWhitelistSwapTokens(NEO_MAINNET_TOKENS),
  [TESTNET]: Object.keys(NEO_TESTNET_TOKENS).map((key) => {
    return NEO_TESTNET_TOKENS[key];
  }),
};


// contracts
export const SWAP_CONTRACT_HASH =
  "";
export const FARM_CONTRACT_HASH =
  "";

// tokens
export const NEP_CONTRACT_HASH = "0xf7102573e4ea1779cf4f006401bdd07c454bcca4";

const NEP_TOKEN = {
  hash: NEP_CONTRACT_HASH,
  symbol: "NEP",
  icon: "/symbols/nep.png",
  decimals: 8
};


export const TOKEN_LIST = {
  [NEP_CONTRACT_HASH]: {
    ...NEP_TOKEN
  },

};

export const SWAP_TOKEN_LIST = [NEP_TOKEN];

// contracts
// export const SWAP_CONTRACT_HASH = "0xce432034f30ed0012d54af92fb958ab7662d0c85";
export const SWAP_CONTRACT_HASH = "0x7f8354B2DD34d3A79f29bd9BD00b6c13378C88B0";
export const FARM_CONTRACT_HASH = "";

// tokens
export const NEP_CONTRACT_HASH = "0xf7102573e4ea1779cf4f006401bdd07c454bcca4";
export const USDT_CONTRACT_HASH = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
export const WMATIC_CONTRACT_HASH =
  "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
export const WETH_CONTRACT_HASH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

const NEP_TOKEN = {
  hash: NEP_CONTRACT_HASH,
  symbol: "NEP",
  icon: "/symbols/nep.png",
  decimals: 8
};

const USDT_TOKEN = {
  hash: USDT_CONTRACT_HASH,
  symbol: "USDT",
  icon: "/symbols/usdt.png",
  decimals: 6
};
const WMATIC_TOKEN = {
  hash: WMATIC_CONTRACT_HASH,
  symbol: "WMATIC",
  icon: "/symbols/wMatic.jpeg",
  decimals: 18
};
const WETH_TOKEN = {
  hash: WETH_CONTRACT_HASH,
  symbol: "WETH",
  icon: "/symbols/eth.png",
  decimals: 18
};

export const TOKEN_LIST = {
  [NEP_CONTRACT_HASH]: {
    ...NEP_TOKEN
  },
  [USDT_CONTRACT_HASH]: {
    ...USDT_TOKEN
  },
  [WMATIC_CONTRACT_HASH]: {
    ...WMATIC_TOKEN
  },
  [WETH_CONTRACT_HASH]: {
    ...WETH_TOKEN
  }
};

export const SWAP_TOKEN_LIST = [NEP_TOKEN, USDT_TOKEN, WMATIC_TOKEN, WETH_TOKEN];
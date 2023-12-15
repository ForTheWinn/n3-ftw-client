export const ETHEREUM_MAINNET_CONTRACTS = {
  SWAP: "0xf4853191973Cd709B9713eA18e9590Af3E99835F",
  FARM: "0x8AB012Ea5371C52c1aE658aFE80F9639296CEF45",
  BRIDGE: "0x75211d135397B73528CbFC35E86D77931E97b78C",
  SMITH: "0x6Cf4098e47207139c3e35929Bf59a1410E195695",
  FNEO: "0x6Aad9002b1bF448EFFef5cf8412bCd81f82Ca0f2",
  NEP: "0xd5f1090dC614343554EEbe5DA69A746880365990",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
};

export const ETHEREUM_MAINNET_NEP_TOKEN_METADATA = {
  hash: ETHEREUM_MAINNET_CONTRACTS.NEP,
  symbol: "NEP",
  icon: "/symbols/nep.png",
  decimals: 8,
};

export const ETHEREUM_MAINNET_FNEO_TOKEN_METADATA = {
  hash: ETHEREUM_MAINNET_CONTRACTS.FNEO,
  symbol: "ftwNEO",
  icon: "/symbols/fneo.svg",
  decimals: 8,
};

const ETHEREUM_MAINNET_USDT_TOKEN_METADATA = {
  hash: ETHEREUM_MAINNET_CONTRACTS.USDT,
  symbol: "USDT",
  icon: "/symbols/usdt.png",
  decimals: 6,
  passApprove: true,
};

const ETHEREUM_MAINNET_WETH_TOKEN_METADATA = {
  hash: ETHEREUM_MAINNET_CONTRACTS.WETH,
  symbol: "WETH",
  icon: "/symbols/eth.png",
  decimals: 18,
};

const ETHEREUM_MAINNET_WBTC_TOKEN_METADATA = {
  hash: ETHEREUM_MAINNET_CONTRACTS.WBTC,
  symbol: "WBTC",
  icon: "/symbols/btc.png",
  decimals: 8,
};

export const ETHEREUM_MAINNET_TOKEN_METADATA_MAP = {
  [ETHEREUM_MAINNET_CONTRACTS.WBTC]: {
    ...ETHEREUM_MAINNET_WBTC_TOKEN_METADATA,
  },
  [ETHEREUM_MAINNET_CONTRACTS.WETH]: {
    ...ETHEREUM_MAINNET_WETH_TOKEN_METADATA,
  },
  [ETHEREUM_MAINNET_CONTRACTS.USDT]: {
    ...ETHEREUM_MAINNET_USDT_TOKEN_METADATA,
  },
  [ETHEREUM_MAINNET_CONTRACTS.NEP]: {
    ...ETHEREUM_MAINNET_NEP_TOKEN_METADATA,
  },
  [ETHEREUM_MAINNET_CONTRACTS.FNEO]: {
    ...ETHEREUM_MAINNET_FNEO_TOKEN_METADATA,
  },
};

export const ETHEREUM_MAINNET_SWAP_TOKEN_MAP = [
  ETHEREUM_MAINNET_NEP_TOKEN_METADATA,
  ETHEREUM_MAINNET_USDT_TOKEN_METADATA,
  ETHEREUM_MAINNET_FNEO_TOKEN_METADATA,
];
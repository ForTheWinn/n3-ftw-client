import {
  MAINNET,
  TESTNET,
  SWAP,
  FARM,
  BRIDGE,
  SMITH,
} from "../../../consts/global";

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
  ETH: "0x0000000000000000000000000000000000001010",
};

export const ETHEREUM_TESTNET_CONTRACTS = {
  SWAP: "0xa5DDb8D476D34C0C015bC28e9526C8DfF38AA7aF",
  FARM: "",
  BRIDGE: "0x30c009780c67dDFc57C4C9f756Cd2798736835B3",
  SMITH: "0xF75b3eb699f779a6d9B07f272a30Ca8708CF8D03",
  FNEO: "",
  NEP: "0x1896aa98E0858de715411ceE40d85132d7BE1FAf",
};

export const ETHEREUM_CONTRACTS = {
  [MAINNET]: {
    [SWAP]: ETHEREUM_MAINNET_CONTRACTS.SWAP,
    [FARM]: ETHEREUM_MAINNET_CONTRACTS.FARM,
    [BRIDGE]: ETHEREUM_MAINNET_CONTRACTS.BRIDGE,
    [SMITH]: ETHEREUM_MAINNET_CONTRACTS.SMITH,
  },
  [TESTNET]: {
    [SWAP]: ETHEREUM_TESTNET_CONTRACTS.SWAP,
    [FARM]: ETHEREUM_TESTNET_CONTRACTS.FARM,
    [BRIDGE]: ETHEREUM_TESTNET_CONTRACTS.BRIDGE,
    [SMITH]: ETHEREUM_TESTNET_CONTRACTS.SMITH,
  },
};

export const ETHEREUM_NEP_CONTRACT_ADDRESSES = {
  [MAINNET]: ETHEREUM_MAINNET_CONTRACTS.NEP,
  [TESTNET]: ETHEREUM_TESTNET_CONTRACTS.NEP,
};

export const ETH_FNEO = {
  name: "Ethereum ftwNEO",
  address: {
    [MAINNET]: ETHEREUM_MAINNET_CONTRACTS.FNEO,
    [TESTNET]: ETHEREUM_TESTNET_CONTRACTS.FNEO,
  },
};

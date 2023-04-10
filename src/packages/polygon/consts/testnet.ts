// contracts
export const SWAP_CONTRACT_HASH = "0x8dc9e791e60065f4ebc9602a09cbd7f13d6f9037";
export const FARM_CONTRACT_HASH = "0x3f9c4d96f1e9e78308470a9767e7dce9f077b8ed";
// "0x262Fd1CddC77316972a0fc8EAbEd09Fd12662883";

// tokens
export const NEP_CONTRACT_HASH = "0x5fd762eed8228f2dc83e129713888bcd0fdc2376";
const DERC_CONTRACT_HASH = "0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1";
const LINK_CONTRACT_HASH = "0x326c977e6efc84e512bb9c30f76e30c160ed06fb";

const NEP_TOKEN = {
  hash: NEP_CONTRACT_HASH,
  symbol: "NEP",
  icon: "/symbols/nep.png",
  decimals: 8
};

const TEST_TOKEN = {
  hash: DERC_CONTRACT_HASH,
  decimals: 18,
  symbol: "DERC",
  icon: "/symbols/unknown.png"
};

const LINK_TOKEN = {
  hash: LINK_CONTRACT_HASH,
  decimals: 18,
  symbol: "LINK",
  icon: "/symbols/unknown.png"
};

// export const POLYGON_TOKENS: IToken[] = [NEP_TOKEN, TEST_TOKEN];

export const TOKEN_LIST = {
  [NEP_CONTRACT_HASH]: {
    ...NEP_TOKEN
  },
  [DERC_CONTRACT_HASH]: {
    ...TEST_TOKEN
  },
  [LINK_CONTRACT_HASH]: {
    ...LINK_TOKEN
  }
};

export const SWAP_TOKEN_LIST = [NEP_TOKEN, TEST_TOKEN, LINK_TOKEN];

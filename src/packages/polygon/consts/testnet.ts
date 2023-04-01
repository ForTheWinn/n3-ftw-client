// contracts
export const SWAP_CONTRACT_HASH = "0x8DC9E791E60065f4Ebc9602A09CBD7f13d6F9037";
export const FARM_CONTRACT_HASH = "0x3f9c4D96F1E9E78308470a9767e7dCe9f077B8eD";
// "0x262Fd1CddC77316972a0fc8EAbEd09Fd12662883";

// tokens
const NEP_CONTRACT_HASH = "0x5fD762EED8228f2dc83E129713888bcD0fDc2376";
const DERC_CONTRACT_HASH = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
const LINK_CONTRACT_HASH = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";

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

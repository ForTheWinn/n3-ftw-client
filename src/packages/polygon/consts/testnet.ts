// contracts
export const SWAP_CONTRACT_HASH = "0x7d421f7e8a635e0ccfc68e47de4df8571056ce21";
export const FARM_CONTRACT_HASH = "0x3a63d435d20bc370a1e3e8f1da03fa2b85576b99";

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

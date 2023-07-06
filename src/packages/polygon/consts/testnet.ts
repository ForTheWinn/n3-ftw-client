// contracts
export const SWAP_CONTRACT_HASH = "0x7d421f7e8a635e0ccfc68e47de4df8571056ce21";
export const FARM_CONTRACT_HASH = "0x3a63d435d20bc370a1e3e8f1da03fa2b85576b99";
export const BRIDGE_CONTRACT_HASH =
  "0xE6Eea8610955eCD31edcdbB2DDCB2A937BDe419A";
// export const SMITH_CONTRACT_HASH = "0x322EA86f3A79bEc0Ee758d994b5d9150e96d5F1d";
export const SMITH_CONTRACT_HASH = "0x0D1B88A1a3625e4beD803AE8AEFB70cfF94350A9";

// tokens
export const FNEO_CONTRACT_HASH = "0x55b93eC91127e227b9a62393aBE009CA0eaffCeB";
export const NEP_CONTRACT_HASH = "0x044d2d7a374286325eeF1fF5e6Ba6251E5Bd049C";
// const DERC_CONTRACT_HASH = "0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1";
// const LINK_CONTRACT_HASH = "0x326c977e6efc84e512bb9c30f76e30c160ed06fb";

export const FNEO_TESTNET_DETAIL = {
  hash: FNEO_CONTRACT_HASH,
  symbol: "ftwNEO",
  icon: "/symbols/neo.svg",
  decimals: 8
};

export const NEP_TESTNET_DETAIL = {
  hash: NEP_CONTRACT_HASH,
  symbol: "NEP",
  icon: "/symbols/nep.png",
  decimals: 8
};

// const TEST_TOKEN = {
//   hash: DERC_CONTRACT_HASH,
//   decimals: 18,
//   symbol: "DERC",
//   icon: "/symbols/unknown.png"
// };

// const LINK_TOKEN = {
//   hash: LINK_CONTRACT_HASH,
//   decimals: 18,
//   symbol: "LINK",
//   icon: "/symbols/unknown.png"
// };

export const TOKEN_LIST = {
  [FNEO_CONTRACT_HASH]: {
    ...FNEO_TESTNET_DETAIL
  },
  [NEP_CONTRACT_HASH]: {
    ...NEP_TESTNET_DETAIL
  }
  // [DERC_CONTRACT_HASH]: {
  //   ...TEST_TOKEN
  // },
  // [LINK_CONTRACT_HASH]: {
  //   ...LINK_TOKEN
  // }
};

export const SWAP_TOKEN_LIST = [
  FNEO_TESTNET_DETAIL,
  NEP_TESTNET_DETAIL
  // TEST_TOKEN,
  // LINK_TOKEN
];

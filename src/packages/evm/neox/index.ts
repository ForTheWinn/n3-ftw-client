import { MAINNET, TESTNET, SMITH, SWAP, FARM } from "../../../consts/global";

export const NEOX_MAINNET_CONTRACTS = {
  SMITH: "0x36f3b75D455F293eA9dCE48cEcb6790E311FcfDD",
  NEP: "0x30c009780c67dDFc57C4C9f756Cd2798736835B3",
  SWAP: "0x1dD0050e857b28855dc1d51Bb6594aed70f7E26d",
  FARM: "0x39C1Fe7C33139c187B9ab8b91E69CDf6F83308DB",
  FNEO: "0xa4ff1534E70703C61fE2a9d579784dc2158af913",
  TEST1: "0xc6B03BEa34f6243054455d5aaB41430200F6387c",
  TEST2: "0x8780063989dd430FEEc469AB6b345c9E53E221F1",
  GAS: "",
  WGAS: "0x8095581030409afc716d5f35Ce5172e13d7bA316",
};

export const NEOX_CONTRACTS = {
  [MAINNET]: {
    [SMITH]: NEOX_MAINNET_CONTRACTS.SMITH,
    [SWAP]: NEOX_MAINNET_CONTRACTS.SWAP,
    [FARM]: NEOX_MAINNET_CONTRACTS.FARM,
  },
  [TESTNET]: {
    [SMITH]: NEOX_MAINNET_CONTRACTS.SMITH,
    [SWAP]: NEOX_MAINNET_CONTRACTS.SWAP,
    [FARM]: NEOX_MAINNET_CONTRACTS.FARM,
  },
};

export const NEOX_NEP_ADDRESSES = {
  [MAINNET]: NEOX_MAINNET_CONTRACTS.NEP,
  [TESTNET]: NEOX_MAINNET_CONTRACTS.NEP,
};

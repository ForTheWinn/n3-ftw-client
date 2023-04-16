import { MAINNET, TESTNET } from "../../../../../consts/global";

export const RUNE_SCRIPT_HASH = {
  [TESTNET]: "0x9f30d01b85887d0927c01640d5789d908e7c315a",
  [MAINNET]: "0xbebd4eb7c09ca5b59004aa8b58c9bfc81270e5d6"
};

export const RUNE_PRICE = {
  [TESTNET]: "0.1", // Testnet mint is cheaper than mainnet
  [MAINNET]: "10"
};

export const RUNE_PHASE_FILTER = [
  "All",
  "Fire",
  "Water",
  "Wood",
  "Earth",
  "Metal",
  "Dark",
  "Light"
];

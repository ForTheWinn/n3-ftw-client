import { MAINNET, TESTNET } from "../../../../../consts/global";

export const LOCKER_SCRIPT_HASH = {
  [TESTNET]: "0x31e6889f099e645ff2c281b2d77a0119fe44f178",
  [MAINNET]: "0x8a8c112e35d77238c2e7baeacb3dc253f6213a1e"
};

export const LOCKER_NEP_FEE = {
  [TESTNET]: 100_00000000,
  [MAINNET]: 1000_00000000
};

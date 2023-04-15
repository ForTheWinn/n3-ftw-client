import { GLOBAL } from "../../../../../consts";
const { TESTNET, MAINNET } = GLOBAL;

export const GASFI_SCRIPT_HASH = {
  [TESTNET]: "0x14c394c55f955baa92875d26f01f96710829ab91",
  [MAINNET]: "0xbc54874a9505e668bc0af9301ff261fcc4a640ee"
};

/**
 * Those numbers should be matched with contract's
 */
export const POSITION_RANGE = 2;
export const DRAWING_FREQUENCY = 604800000; // millisecond

import { MAINNET, TESTNET } from "../../../../../consts/global";

export const GASFI_SCRIPT_HASH = {
  [TESTNET]: "0x4b24fa585b80acdf72137b2415cbb9417cdadc4d",
  [MAINNET]: "0xbc54874a9505e668bc0af9301ff261fcc4a640ee",
};

/**
 * Those numbers should be matched with contract's
 */
export const DRAWING_FREQUENCY = 86400000 ; // millisecond

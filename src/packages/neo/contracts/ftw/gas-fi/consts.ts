import { MAINNET, TESTNET } from "../../../../../consts/global";

export const GASFI_SCRIPT_HASH = {
  [TESTNET]: "0x9a3e8b48c083f0221d746a908c3c2f0cc5a87727",
  [MAINNET]: "0x74a0ce01aefc1348d112f4a721a87b2206680a42",
};

/**
 * Those numbers should be matched with contract's
 */
export const DRAWING_FREQUENCY = 86400000 ; // millisecond

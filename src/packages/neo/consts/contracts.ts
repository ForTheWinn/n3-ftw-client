import { FARM, MAINNET, SWAP, TESTNET } from "../../../consts/global";
import { FARM_V2_SCRIPT_HASH } from "../contracts/ftw/farm-v2/consts";
import { SWAP_SCRIPT_HASH } from "../contracts/ftw/swap/consts";

export const CONTRACT_LIST = {
  [MAINNET]: {
    [SWAP]: SWAP_SCRIPT_HASH[MAINNET],
    [FARM]: FARM_V2_SCRIPT_HASH[MAINNET]
  },
  [TESTNET]: {
    [SWAP]: SWAP_SCRIPT_HASH[TESTNET],
    [FARM]: FARM_V2_SCRIPT_HASH[TESTNET]
  }
};

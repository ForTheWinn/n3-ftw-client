import { FARM, MAINNET, SWAP, TESTNET } from "../../../consts/global";
import { FARM_SCRIPT_HASH } from "../contracts/ftw/farm/consts";
import { SWAP_SCRIPT_HASH } from "../contracts/ftw/swap/consts";

export const CONTRACT_LIST = {
  [MAINNET]: {
    [SWAP]: SWAP_SCRIPT_HASH[MAINNET],
    [FARM]: FARM_SCRIPT_HASH[MAINNET]
  },
  [TESTNET]: {
    [SWAP]: SWAP_SCRIPT_HASH[TESTNET],
    [FARM]: FARM_SCRIPT_HASH[TESTNET]
  }
};

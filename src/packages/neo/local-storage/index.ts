import store from "store2";
import {
  ETH_WALLET,
  NEO_WALLET,
} from "../../../ui/components/Commons/Wallets/consts";
import { CHAINS, LIST } from "../../../consts/chains";
import { NEO_CHAIN } from "../../../consts/global";

const CURRENT_WALLET_TYPE = "WALLET_SWITCH";
const CURRENT_CHAIN = "CHAIN_SWITCH";

export class LocalStorage {
  static setWalletSwitchType = (val: typeof NEO_WALLET | typeof ETH_WALLET) =>
    store.set(CURRENT_WALLET_TYPE, val);

  // Get the last wallet switch used.
  static getWalletSwitch = () =>
    store.get(CURRENT_WALLET_TYPE)
      ? store.get(CURRENT_WALLET_TYPE)
      : NEO_WALLET;

  static setChain = (val: CHAINS) => store.set(CURRENT_CHAIN, val);
  
  static getChain = (): CHAINS => {
    if (store.get(CURRENT_CHAIN)) {
      LIST.forEach((chain) => {
        if (store.get(CURRENT_CHAIN) === chain) {
          return store.get(CURRENT_CHAIN);
        }
      });
    }

    return NEO_CHAIN;
  };
}

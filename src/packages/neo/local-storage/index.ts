import store from "store2";
import {
  ETH_WALLET,
  NEO_WALLET,
} from "../../../ui/components/Commons/Wallets/consts";
import { CHAINS, LIST } from "../../../consts/chains";
import { NEO_CHAIN } from "../../../consts/global";
import { INetworkType } from "../network";
import { IToken } from "../../../consts/tokens";

const CURRENT_WALLET_TYPE_KEY = "WALLET_SWITCH";
const CURRENT_CHAIN_KEY = "CHAIN_SWITCH";

type WalletType = typeof NEO_WALLET | typeof ETH_WALLET;

export class LocalStorage {
  static setWalletSwitchType(val: WalletType): void {
    store.set(CURRENT_WALLET_TYPE_KEY, val);
  }

  static getWalletSwitch(): WalletType {
    return store.get(CURRENT_WALLET_TYPE_KEY) || NEO_WALLET;
  }

  static setChain(val: CHAINS): void {
    store.set(CURRENT_CHAIN_KEY, val);
  }

  static getChain(): CHAINS {
    const storedChain = store.get(CURRENT_CHAIN_KEY);
    return LIST.includes(storedChain) ? storedChain : NEO_CHAIN;
  }

  static setToken(chain: CHAINS, network: INetworkType, token: IToken): void {
    const key = `${chain}-${network}-TOKEN`;
    let tokenList: IToken[] = store.get(key) || [];

    // Ensure tokenList is always an array
    if (!Array.isArray(tokenList)) {
      tokenList = [];
    }

    // Check if the token already exists in the list
    const tokenExists = tokenList.some(
      (existingToken) => existingToken.hash === token.hash
    );

    // Add the token only if it does not exist
    if (!tokenExists) {
      tokenList.push(token);
      store.set(key, tokenList);
    }
  }
  static getToken(chain: CHAINS, network: INetworkType): IToken[] {
    const key = `${chain}-${network}-TOKEN`;
    return store.get(key) || [];
  }
}

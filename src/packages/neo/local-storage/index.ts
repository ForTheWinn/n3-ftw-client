import store from "store2";
import { IConnectedWallet, ITransaction } from "../wallet/interfaces";
import { RUNE_SCRIPT_HASH } from "../contracts";
import { MAINNET } from "../consts";
import { INetworkType } from "../network";
import { validateConnectedWallet } from "./helpers";
import { ETH_WALLET, NEO_WALLET } from "../../ui/Wallet/consts";
import { CHAINS, NEO_CHAIN } from "../../chains/consts";

const CONNECTED_WALLET = "CONNECTED_WALLET";
const TRANSACTIONS = "TRANSACTIONS";
const NETWORK = "NETWORK";
const SWAP_TOKEN_A = "SWAP_TOKEN_A";
const SWAP_TOKEN_B = "SWAP_TOKEN_B";
const WALLET_SWITCH = "WALLET_SWITCH";
const CHAIN_SWITCH = "CHAIN_SWITCH";

export class LocalStorage {
  public static initStorage = (network: string): ITransaction[] => {
    const supportContracts = [RUNE_SCRIPT_HASH[network]];
    const transactions = LocalStorage.getTransactions();
    const validatedTx: ITransaction[] = [];
    transactions.forEach((tx) => {
      if (supportContracts.includes(tx.contractHash)) {
        validatedTx.push(tx);
      } else {
        LocalStorage.removeTransaction(tx);
      }
    });
    return validatedTx;
  };

  public static getNetwork = () => {
    return store.get(NETWORK) ? store.get(NETWORK) : MAINNET;
  };

  public static setNetwork = (network: INetworkType) => {
    return store.set(NETWORK, network);
  };

  public static getWallet = (): IConnectedWallet | undefined =>
    validateConnectedWallet(store.get(CONNECTED_WALLET));

  public static setWallet(connectedWallet: IConnectedWallet) {
    const validated = validateConnectedWallet(connectedWallet);
    store.set(CONNECTED_WALLET, validated);
  }

  public static removeWallet() {
    store.remove(CONNECTED_WALLET);
  }

  public static getTransactions = (): ITransaction[] =>
    store.has(TRANSACTIONS) ? store.get(TRANSACTIONS) : [];

  public static addTransaction(tx: ITransaction) {
    if (store.has(TRANSACTIONS)) {
      store.add(TRANSACTIONS, tx);
    } else {
      store.set(TRANSACTIONS, [tx]);
    }
    window.dispatchEvent(new Event("transactions"));
  }

  public static updatePendingTransaction(txId: string) {
    let transactions = store.get(TRANSACTIONS);
    transactions = transactions.map((tx) => {
      if (tx.txid === txId) {
        tx.status = "SUBMITTED";
      }
      return tx;
    });
    store.set(TRANSACTIONS, transactions);
  }

  public static removeTransaction = (tx: ITransaction) =>
    store.remove(TRANSACTIONS, tx);

  public static clearTransaction = () => store.set(TRANSACTIONS, []);

  static setSwapTokenA = (val: string) => store.set(SWAP_TOKEN_A, val);
  static setSwapTokenB = (val: string) => store.set(SWAP_TOKEN_B, val);
  static getSwapTokenA = () => store.get(SWAP_TOKEN_A);
  static getSwapTokenB = () => store.get(SWAP_TOKEN_B);

  static setWalletSwitchType = (val: typeof NEO_WALLET | typeof ETH_WALLET) =>
    store.set(WALLET_SWITCH, val);
  static getWalletSwitch = () =>
    store.get(WALLET_SWITCH) ? store.get(WALLET_SWITCH) : NEO_WALLET;

  static setChain = (val: CHAINS) => store.set(CHAIN_SWITCH, val);
  static getChain = () =>
    store.get(CHAIN_SWITCH) ? store.get(CHAIN_SWITCH) : NEO_CHAIN;
}

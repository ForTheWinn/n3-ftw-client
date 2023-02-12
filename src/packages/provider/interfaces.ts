import {IConnectedWallet, IETHWalletType, IWalletType} from "../neo/wallet/interfaces";
import { INetworkType } from "../neo/network";
import { sc } from "@cityofzion/neon-core";

export interface IWalletStates {
  useDevWallet?: boolean;
  list: {
    key: IWalletType;
    label: string;
  }[];
  invokeScript?: sc.ContractCallJson;
  network: INetworkType;
  connectedWallet?: IConnectedWallet;
  isWalletModalActive: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  connectWallet: (wallet: IWalletType) => void;
  disConnectWallet: () => void;
  doInvoke: (invokeScript: sc.ContractCallJson) => void;
  addPendingTransaction: (txid: string) => void;
  removePendingTransaction: (txid: string) => void;
  closeInvoke: () => void;
  pendingTransactions: string[];
  switchNetwork: (network: INetworkType) => void;
  totalTxSubmit: number;
  increaseTotalTxSubmit: () => void;
}

export interface ContextOptions {
  useLocalStorage?: boolean;
  useDevWallet?: boolean;
}

import { NEO_LINE, NEON, O3, ONE_GATE, NEO_LINE_MOBILE } from "../consts";
import { INetworkType } from "../network";

export type IWalletType =
  | typeof O3
  | typeof NEO_LINE
  | typeof ONE_GATE
  | typeof NEO_LINE_MOBILE
  | typeof NEON;

export interface IConnectedWallet {
  key: IWalletType;
  instance: any;
  account: any;
  network?: any;
}

export interface IConnectedETHWallet {
  key: IWalletType;
  account: any;
  network?: any;
}

export interface IBalance {
  contract: string;
  symbol: string;
  amount: string;
}

export interface ITransaction {
  invokeScript?: any;
  network: INetworkType;
  wallet: IWalletType;
  // status: "PENDING" | "SUBMITTED";
  txid: string;
  contractHash: string;
  method: string;
  args: any;
  createdAt: string;
}

export interface ITxReceipt {
  txid: string;
  nodeUrl: string;
}

export type IContractCallArgs =
  | "String"
  | "Boolean"
  | "Hash160"
  | "Hash256"
  | "Integer"
  | "ByteArray"
  | "Array"
  | "Address";

import { DEV, NEO_LINE, NEON, O3, ONE_GATE } from "../consts";
import { INetworkType } from "../network";
import {COINBASE_WALLET, META_MASK} from "../../web3/consts";

export type IWalletType =
  | typeof O3
  | typeof NEO_LINE
  | typeof DEV
  | typeof ONE_GATE
  | typeof NEON;


export type IETHWalletType =
	| typeof META_MASK
	| typeof COINBASE_WALLET

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
	invokeScript?: any
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

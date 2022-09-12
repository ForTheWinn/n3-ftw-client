import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { wallet } from "../../../index";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";

import { parseMapValue, toDecimal } from "../../../utils";
import { u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { GASFI_SCRIPT_HASH } from "./consts";
import { BNEO_SCRIPT_HASH } from "../../../consts/nep17-list";
import {IDrawsResult, IStakeResult, IStatusResult} from "./interfaces";
import {ILockerContracts} from "../locker/interface";

export class GasFiContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = GASFI_SCRIPT_HASH[networkType];
  }

  stake = async (
    connectedWallet: IConnectedWallet,
    amount: number,
    position: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: BNEO_SCRIPT_HASH[this.network],
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: this.contractHash,
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(amount, 8).toString(),
        },
        {
          type: "Integer",
          value: position,
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  unStake = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "removeFund",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  draw = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "createSnapshot",
      scriptHash: this.contractHash,
      args: [],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  claim = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "claim",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getStatus = async (): Promise<IStatusResult> => {
    const stake = {
      operation: "status",
      scriptHash: this.contractHash,
      args: [],
    };
    const res = await Network.read(this.network, [stake]);
    console.log(res);
    return parseMapValue(res.stack[0] as any);
  };

  getStake = async (connectedWallet): Promise<IStakeResult | undefined> => {
    const stake = {
      operation: "getStake",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: connectedWallet.account.address,
        },
      ],
    };
    /* getStake throws exception if there is no staking data */
    const res = await Network.read(this.network, [stake]);
    if (res.state === "HALT") {
      return parseMapValue(res.stack[0] as any);
    } else {
      return undefined;
    }
  };

	getDraws = async (page: number): Promise<IDrawsResult> => {
		const script = {
			scriptHash: this.contractHash,
			operation: "getDraws",
			args: [
				{
					type: "Integer",
					value: "30",
				},
				{
					type: "Integer",
					value: page,
				},
			],
		};
		const res = await Network.read(this.network, [script]);
		if (res.state === "FAULT") {
			throw new Error(res.exception as string);
		}
		return parseMapValue(res.stack[0] as any);
	};
}

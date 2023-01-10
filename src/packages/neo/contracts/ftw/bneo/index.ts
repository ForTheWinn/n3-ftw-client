import { INetworkType } from "../../../network";
import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
} from "../../../consts/nep17-list";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { wallet as NeonWallet } from "@cityofzion/neon-core";
import { wallet } from "../../../index";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";

export class BNEOContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = BNEO_SCRIPT_HASH[networkType];
  }

  mint = async (
    connectedWallet: IConnectedWallet,
    amount: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: NEO_SCRIPT_HASH,
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
          value: amount,
        },
        {
          type: "Any",
          value: null,
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  redeem = async (
    connectedWallet: IConnectedWallet,
    amount: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: GAS_SCRIPT_HASH,
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
          value: amount * 100000,
        },
        {
          type: "Any",
          value: null,
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };
}

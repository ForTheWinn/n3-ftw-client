import { INetworkType } from "../../../network";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_GAS_CONTRACT_ADDRESS,
  NEO_NEO_CONTRACT_ADDRESS,
} from "../../../consts/tokens";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { wallet as NeonWallet } from "@cityofzion/neon-core";
import { getDefaultWitnessScope } from "../../../utils";
import { WalletAPI } from "../../../wallets";

export class BNEOContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = NEO_BNEO_CONTRACT_ADDRESS[networkType];
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
      scriptHash: NEO_NEO_CONTRACT_ADDRESS,
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
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return WalletAPI.invoke(connectedWallet, this.network, invokeScript);
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
      scriptHash: NEO_GAS_CONTRACT_ADDRESS,
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
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };
}

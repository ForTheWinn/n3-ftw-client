import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { wallet } from "../..";
import { NEP_SCRIPT_HASH } from "../../consts/nep17-list";
import { INetworkType } from "../../network";
import { IConnectedWallet } from "../../wallet/interfaces";

export class GMContract {
  network: INetworkType;
  contractHash: string;
  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = "0xcc638d55d99fc81295daccbaf722b84f179fb9c4";
  }

  buy = async (
    connectedWallet: IConnectedWallet,
    auctionId: string,
    amount: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );

    const signers = [
      {
        account: senderHash,
        scopes: tx.WitnessScope.CustomContracts,
        allowedContracts: [
          // contract.assetHash,
          NEP_SCRIPT_HASH[this.network],
          this.contractHash,
        ],
      },
    ];

    const invokeScript: any = {
      operation: "bidToken",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Integer",
          value: auctionId,
        },
        {
          type: "Integer",
          value: amount,
        },
      ],
    };

    invokeScript.signers = signers;
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };
}

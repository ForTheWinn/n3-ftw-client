import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { wallet } from "../../../index";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";
import { IIDOStatus } from "./interface";
import { IDO_SCRIPT_HASH } from "./consts";
import {
  BNEO_SCRIPT_HASH,
  FLM_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  GM_SCRIPT_HASH,
  LRB_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
  NEP_SCRIPT_HASH
} from "../../../consts/neo-token-hashes";

export class IDOContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = IDO_SCRIPT_HASH[networkType];
  }

  buy = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    decimals: number,
    amount: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "Hash160",
          value: this.contractHash
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(amount, decimals).toString()
        },
        {
          type: "String",
          value: "1"
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getIDOStatus = async (
    connectedWallet?: IConnectedWallet
  ): Promise<IIDOStatus> => {
    const script1 = {
      scriptHash: this.contractHash,
      operation: "getTotalMint"
    };

    const script2 = {
      scriptHash: this.contractHash,
      operation: "getLaunchDate"
    };

    const script3 = {
      scriptHash: NEP_SCRIPT_HASH[this.network],
      operation: "balanceOf",
      args: [
        {
          type: "Hash160",
          value: this.contractHash
        }
      ]
    };

    const scripts = [script1, script2, script3];

    if (connectedWallet) {
      const senderHash = NeonWallet.getScriptHashFromAddress(
        connectedWallet.account.address
      );
      const script4 = {
        scriptHash: NEO_SCRIPT_HASH,
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      const script5 = {
        scriptHash: GAS_SCRIPT_HASH,
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      const script6 = {
        scriptHash: BNEO_SCRIPT_HASH[this.network],
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      const script7 = {
        scriptHash: FLM_SCRIPT_HASH[this.network],
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      const script8 = {
        scriptHash: GM_SCRIPT_HASH[this.network],
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      const script9 = {
        scriptHash: LRB_SCRIPT_HASH[this.network],
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      scripts.push(script4);
      scripts.push(script5);
      scripts.push(script6);
      scripts.push(script7);
      scripts.push(script8);
      scripts.push(script9);
    }
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      totalSales: parseFloat(res.stack[0].value as string),
      launchAt: parseFloat(res.stack[1].value as string),
      availableBalance: parseFloat(res.stack[2].value as string),
      balances: {
        [NEO_SCRIPT_HASH]: connectedWallet
          ? parseFloat(res.stack[3].value as string)
          : 0,
        [GAS_SCRIPT_HASH]: connectedWallet
          ? parseFloat(res.stack[4].value as string)
          : 0,
        [BNEO_SCRIPT_HASH[this.network]]: connectedWallet
          ? parseFloat(res.stack[5].value as string)
          : 0,
        [FLM_SCRIPT_HASH[this.network]]: connectedWallet
          ? parseFloat(res.stack[6].value as string)
          : 0,
        [GM_SCRIPT_HASH[this.network]]: connectedWallet
          ? parseFloat(res.stack[7].value as string)
          : 0,
        [LRB_SCRIPT_HASH[this.network]]: connectedWallet
          ? parseFloat(res.stack[8].value as string)
          : 0
      }
    };
  };
}

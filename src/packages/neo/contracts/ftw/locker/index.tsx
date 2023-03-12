import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { wallet } from "../../../index";
import { LOCKER_SCRIPT_HASH } from "./consts";
import { NEP_SCRIPT_HASH } from "../../../consts/nep17-list";
import { parseMapValue } from "../../../utils";
import {
  ILocker,
  ILockerContract,
  ILockerContracts,
  ILockerKeyToken,
  ILockersByToken,
} from "./interface";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";

export class LockerContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = LOCKER_SCRIPT_HASH[networkType];
  }

  create = async (
    connectedWallet: IConnectedWallet,
    contract: {
      assetHash: string;
      symbol: string;
      decimals: number;
    },
    receiver: string,
    amount: number,
    releaseAt: number,
    title: string,
    description: string,
    invokeCount
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    receiver = NeonWallet.getScriptHashFromAddress(receiver);

    const signers = [
      {
        account: senderHash,
        scopes: tx.WitnessScope.CustomContracts,
        allowedContracts: [
          contract.assetHash,
          NEP_SCRIPT_HASH[this.network],
          this.contractHash,
        ],
      },
    ];

    const invokeScript: any = {
      operation: "lock",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contract.assetHash,
        },
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: receiver,
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(amount, contract.decimals).toString(),
        },
        {
          type: "Integer",
          value: releaseAt,
        },
        {
          type: "String",
          value: title,
        },
        {
          type: "String",
          value: description,
        },
      ],
    };

    if (invokeCount === 1) {
      invokeScript.signers = signers;
      return wallet.WalletAPI.invoke(
        connectedWallet,
        this.network,
        invokeScript
      );
    } else {
      console.log(invokeCount)
      const invokes: any[] = [];
      for (var i = 0; i < invokeCount; ++i) {
        invokes.push(invokeScript);
      }
      return wallet.WalletAPI.invokeMulti(
        connectedWallet,
        this.network,
        invokes,
        signers
      );
    }
  };

  unLock = async (connectedWallet, lockerNo): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: this.contractHash,
        },
        {
          type: "String",
          value: lockerNo,
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

  getContract = async (contractHash): Promise<ILockerContract> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getContract",
      args: [
        {
          type: "Hash160",
          value: contractHash,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getContracts = async (): Promise<ILockerContracts> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getContracts",
      args: [
        {
          type: "Integer",
          value: "30",
        },
        {
          type: "Integer",
          value: "1",
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getLockerByNo = async (no: string): Promise<ILocker> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getLocker",
      args: [
        {
          type: "Integer",
          value: no,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getLockersByContract = async (
    contractHash: string,
    page: number
  ): Promise<ILockersByToken> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getLockersByContract",
      args: [
        {
          type: "Hash160",
          value: contractHash,
        },
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

  getLockerKeys = async (address: string): Promise<ILockerKeyToken[]> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getKeys",
      args: [
        {
          type: "Hash160",
          value: NeonWallet.getScriptHashFromAddress(address),
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // @ts-ignore
    return res.stack[0].value.map((item) => parseMapValue(item));
  };
}

import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { LOCKER_SCRIPT_HASH } from "./consts";
import { NEO_NEP_CONTRACT_ADDRESS } from "../../../consts/tokens";
import { parseMapValue } from "../../../utils";
import {
  ILocker,
  ILockerContract,
  ILockerContracts,
  ILockerKeyToken,
  ILockersByToken,
} from "./interface";
import { getDefaultWitnessScope } from "../../../utils";
import { IToken } from "../../../../../consts/tokens";
import { NeoWallets } from "../../../wallets";

export class LockerContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = LOCKER_SCRIPT_HASH[networkType];
  }

  create = async (
    connectedWallet: IConnectedWallet,
    contract: IToken,
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
          contract.hash,
          NEO_NEP_CONTRACT_ADDRESS[this.network],
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
          value: contract.hash,
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

      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [
            contract.hash,
            NEO_NEP_CONTRACT_ADDRESS[this.network],
            this.contractHash,
          ],
        },
      ],
    };

    if (invokeCount === 1) {
      invokeScript.signers = signers;
      return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
    } else {
      const invokes: any[] = [];
      for (var i = 0; i < invokeCount; ++i) {
        invokes.push(invokeScript);
      }
      return NeoWallets.invokeMulti(
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
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
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

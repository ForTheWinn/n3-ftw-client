import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { wallet } from "../../../index";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";

import { parseMapValue } from "../../../utils";
import { u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { GASFI_SCRIPT_HASH } from "./consts";
import { BNEO_SCRIPT_HASH } from "../../../consts/nep17-list";
import {
  IClaimableResult,
  IDrawsResult,
  IStakeResult,
  IStatusResult,
} from "./interfaces";

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
      operation: "unStake",
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
      operation: "draw",
      scriptHash: this.contractHash,
      args: [],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  claim = async (
    connectedWallet: IConnectedWallet,
    drawNo: number
  ): Promise<string> => {
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
        {
          type: "Integer",
          value: drawNo,
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  claimAll = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "claimAll",
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

  getClaimable = async (
    connectedWallet: IConnectedWallet
  ): Promise<IClaimableResult | undefined> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const script = {
      operation: "getClaimable",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "HALT") {
      // Hard coding to part Array stack from the chain.
      const obj: any = parseMapValue(res.stack[0] as any);
      obj.claimableNumbers = obj.claimableNumbers.map((v) =>
        parseFloat(v.value)
      );
      return obj;
    } else {
      return undefined;
    }
  };

  getStatus = async (): Promise<IStatusResult> => {
    const stake = {
      operation: "status",
      scriptHash: this.contractHash,
      args: [],
    };
    const res = await Network.read(this.network, [stake]);
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

  getClaims = async (connectedWallet: IConnectedWallet): Promise<any> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getClaims",
      args: [
        {
          type: "Hash160",
          value: connectedWallet.account.address,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
		console.log(res)
    if (res.state === "HALT") {
      return res.stack[0] &&
        res.stack[0].value &&
        Array.isArray(res.stack[0].value)
        ? res.stack[0].value.map((item: any) => parseMapValue(item))
        : [];
    } else {
      return [];
    }
  };
}

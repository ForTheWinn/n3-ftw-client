import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { wallet } from "../../../index";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";

import { parseMapValue, toDecimal } from "../../../utils";
import { u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { GASFI_SCRIPT_HASH } from "./consts";
import { NEO_BNEO_CONTRACT_ADDRESS } from "../../../consts/neo-contracts";
import {
  IClaimableResult,
  IDrawsResult,
  IGASFiStatus,
  IStakeResult,
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
      scriptHash: NEO_BNEO_CONTRACT_ADDRESS[this.network],
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

  getStatus = async (
    connectedWallet?: IConnectedWallet
  ): Promise<IGASFiStatus> => {
    const scripts: any = [
      {
        operation: "status",
        scriptHash: this.contractHash,
        args: [],
      },
    ];

    if (connectedWallet) {
      const senderHash = NeonWallet.getScriptHashFromAddress(
        connectedWallet.account.address
      );
      const stake = {
        operation: "getStake",
        scriptHash: this.contractHash,
        args: [
          {
            type: "Hash160",
            value: senderHash,
          },
        ],
      };
      const claimable = {
        operation: "getClaimable",
        scriptHash: this.contractHash,
        args: [
          {
            type: "Hash160",
            value: senderHash,
          },
        ],
      };
      const bNEOBalance = {
        operation: "balanceOf",
        scriptHash: NEO_BNEO_CONTRACT_ADDRESS[this.network],
        args: [
          {
            type: "Hash160",
            value: senderHash,
          },
        ],
      };
      scripts.push(stake);
      scripts.push(claimable);
      scripts.push(bNEOBalance);
    }

    const res = await Network.read(this.network, scripts);
    const obj: IGASFiStatus = { status: parseMapValue(res.stack[0] as any) };
    if (connectedWallet) {
      obj.staking = res.stack[1].value
        ? parseMapValue(res.stack[1] as any)
        : undefined;
      obj.claimable = res.stack[2].value
        ? parseMapValue(res.stack[2] as any)
        : undefined;
      obj.bNEOBalance = toDecimal(res.stack[3].value as any);
    }
    return obj;
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
    const res = await Network.read(this.network, [stake]);
    if (res.state === "HALT") {
      return res.stack[0].value
        ? parseMapValue(res.stack[0] as any)
        : undefined;
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
    if (res.state === "HALT") {
      return res.stack[0] &&
        res.stack[0].value &&
        Array.isArray(res.stack[0].value)
        ? res.stack[0].value.map((item: any) => {
            return parseMapValue(item);
          })
        : [];
    } else {
      return [];
    }
  };
}

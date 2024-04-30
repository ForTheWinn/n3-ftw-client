import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { getDefaultWitnessScope } from "../../../utils";

import { parseMapValue, toDecimal } from "../../../utils";
import { u, wallet as NeonWallet, tx } from "@cityofzion/neon-core";
import { GASFI_SCRIPT_HASH } from "./consts";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_GAS_CONTRACT_ADDRESS,
} from "../../../consts/tokens";
import { IClaimableResult, IDrawsResult, IStakeResult } from "./interfaces";
import { NeoWallets } from "../../../wallets";
import { NEP_ADDRESSES } from "../../../../../consts/contracts";
import { NEO_CHAIN } from "../../../../../consts/global";
import moment from "moment";

export class GasFiContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = GASFI_SCRIPT_HASH[networkType];
  }

  stake = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "stake",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [
            NEO_BNEO_CONTRACT_ADDRESS[this.network],
            this.contractHash,
          ],
        },
      ],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
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
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  spin = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "spin",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  spinForFree = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "freeSpin",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
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
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
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
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
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

  getStatus = async (connectedWallet?: IConnectedWallet): Promise<any> => {
    const scripts: any = [
      {
        operation: "balanceOf",
        scriptHash: NEO_BNEO_CONTRACT_ADDRESS[this.network],
        args: [
          {
            type: "Hash160",
            value: GASFI_SCRIPT_HASH[this.network],
          },
        ],
      },
      {
        operation: "reward",
        scriptHash: NEO_BNEO_CONTRACT_ADDRESS[this.network],
        args: [
          {
            type: "Hash160",
            value: GASFI_SCRIPT_HASH[this.network],
          },
        ],
      },
      {
        operation: "balanceOf",
        scriptHash: NEO_GAS_CONTRACT_ADDRESS,
        args: [
          {
            type: "Hash160",
            value: GASFI_SCRIPT_HASH[this.network],
          },
        ],
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

      scripts.push({
        operation: "balanceOf",
        scriptHash: NEO_BNEO_CONTRACT_ADDRESS[this.network],
        args: [
          {
            type: "Hash160",
            value: senderHash,
          },
        ],
      });

      scripts.push({
        operation: "canDrawAt",
        scriptHash: this.contractHash,
        args: [
          {
            type: "Hash160",
            value: senderHash,
          },
        ],
      });
    }

    const res = await Network.read(this.network, scripts);
    // if(res.state == "HALT") {
    //   return res.stack.map((item: any) => {
    //     return parseMapValue(item);
    //   });
    // }
    // const obj: IGASFiStatus = { status: parseMapValue(res.stack[0] as any) };
    // if (connectedWallet) {
    //   obj.staking = res.stack[1].value
    //     ? parseMapValue(res.stack[1] as any)
    //     : undefined;
    //   obj.claimable = res.stack[2].value
    //     ? parseMapValue(res.stack[2] as any)
    //     : undefined;
    //   obj.bNEOBalance = toDecimal(res.stack[3].value as any);
    // }
    // return obj;
    const canDrawAt = connectedWallet ? (res.stack[4].value as number) : 0;
    const now = moment().unix();
    return {
      neo: toDecimal(res.stack[0].value as any),
      gas:
        toDecimal(res.stack[1].value as any) +
        toDecimal(res.stack[2].value as any),
      userbNEOBalance: connectedWallet
        ? toDecimal(res.stack[3].value as any)
        : 0,
      isUserStaked: canDrawAt > 0,
      isTimeToSpin: now > canDrawAt,
      nextAvailableToSpin: canDrawAt,
    };
  };

  getStatusForFreeSpin = async (
    connectedWallet?: IConnectedWallet
  ): Promise<any> => {
    const scripts: any = [
      {
        operation: "balanceOf",
        scriptHash: NEP_ADDRESSES[NEO_CHAIN][this.network],
        args: [
          {
            type: "Hash160",
            value: GASFI_SCRIPT_HASH[this.network],
          },
        ],
      },
    ];
    if (connectedWallet) {
      const senderHash = NeonWallet.getScriptHashFromAddress(
        connectedWallet.account.address
      );
      scripts.push({
        operation: "canSpinForFreeAt",
        scriptHash: this.contractHash,
        args: [
          {
            type: "Hash160",
            value: senderHash,
          },
        ],
      });
    }

    const res = await Network.read(this.network, scripts);
    const canDrawAt = connectedWallet
      ? parseFloat(res.stack[1].value as any)
      : 0;
    const now = moment().unix() * 1000;
    return {
      nep: toDecimal(res.stack[0].value as any),
      isTimeToSpin: now >= canDrawAt,
      nextAvailableToSpin: canDrawAt,
    };
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

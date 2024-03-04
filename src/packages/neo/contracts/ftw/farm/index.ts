import { INetworkType, Network } from "../../../network";
import { SWAP_SCRIPT_HASH } from "../swap/consts";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { tx, wallet as NeonWallet } from "@cityofzion/neon-core";
import { getDefaultWitnessScope } from "../../../utils";
import { FARM_SCRIPT_HASH } from "./consts";
import { IClaimableRewards, ILPTokens, IStakingPairs } from "./interfaces";
import {
  parseClaimableMap,
  parsePairsMap,
  parseStakedLPTokensMap,
} from "./helpers";
import { WalletAPI } from "../../../wallets";

export class StakingContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = FARM_SCRIPT_HASH[networkType];
  }

  stake = async (
    connectedWallet: IConnectedWallet,
    tokenId: string
  ): Promise<string> => {
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
        {
          type: "String",
          value: tokenId,
        },
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, SWAP_SCRIPT_HASH[this.network]],
        },
      ],
    };
    return WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  remove = async (
    connectedWallet: IConnectedWallet,
    tokenId: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "withdraw",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "String",
          value: tokenId,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  claim = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    tokenB: string
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
          type: "Hash160",
          value: tokenA,
        },
        {
          type: "Hash160",
          value: tokenB,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  claimMulti = async (
    connectedWallet: IConnectedWallet,
    batch: IClaimableRewards[]
  ) => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "claimMulti",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Array",
          value: batch.map((item) => {
            return {
              type: "Array",
              value: [
                {
                  type: "Hash160",
                  value: item.tokenA,
                },
                {
                  type: "Hash160",
                  value: item.tokenB,
                },
              ],
            };
          }),
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getStakingPairs = async (): Promise<IStakingPairs[]> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getPairs",
      args: [],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parsePairsMap(res as any);
  };

  getTVL = async (tokenA, tokenB) => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getTVL",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
      ],
    };
    const res = await Network.read(this.network, [script]);

    return res.stack[0].value;
  };

  getStakedLPTokens = async (
    connectedWallet: IConnectedWallet
  ): Promise<ILPTokens[]> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getLPTokens",
        args: [{ type: "Hash160", value: senderHash }],
      },
    ];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseStakedLPTokensMap(res as any);
  };

  getClaimable = async (
    connectedWallet?: IConnectedWallet
  ): Promise<IClaimableRewards[]> => {
    if (!connectedWallet) {
      return [];
    } else {
      const senderHash = NeonWallet.getScriptHashFromAddress(
        connectedWallet.account.address
      );
      const scripts = [
        {
          scriptHash: this.contractHash,
          operation: "getClaimable",
          args: [{ type: "Hash160", value: senderHash }],
        },
      ];
      const res = await Network.read(this.network, scripts);
      if (res.state !== "FAULT") {
        return parseClaimableMap(res as any);
      } else {
        console.error(res.exception);
        return [];
      }
    }
  };

  getMarketStatus = async (): Promise<boolean> => {
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getMarketStatus",
        args: [],
      },
    ];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return res.stack[0].value as boolean;
  };
}

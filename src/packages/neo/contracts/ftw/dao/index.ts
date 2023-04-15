import { INetworkType, Network } from "../../../network";

import { IConnectedWallet } from "../../../wallets/interfaces";
import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { wallet } from "../../../index";
import { DAO_SCRIPT_HASH } from "./consts";
import { base64ToString, parseMapValue } from "../../../utils";
import { parseChannelsPaginate } from "./helpers";
import { IChannel, IProposal } from "./interfaces";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";

export class DaoContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = DAO_SCRIPT_HASH[networkType];
  }

  createChannel = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    decimals: string,
    minTokens: string,
    metadata: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "createChannel",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(
            minTokens,
            parseFloat(decimals)
          ).toString()
        },
        {
          type: "String",
          value: metadata
        }
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, contractHash]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  editChannel = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    decimals: number,
    minTokens: string,
    manifest: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "updateManifest",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(minTokens, decimals).toString()
        },
        {
          type: "String",
          value: manifest
        }
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, contractHash]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  createProposal = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    title: string,
    description: string,
    options: string[],
    start: number,
    end: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const optionsToInvokeParams = options.map((op) => {
      return {
        type: "String",
        value: op
      };
    });
    const invokeScript = {
      operation: "createProposal",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "String",
          value: title
        },
        {
          type: "String",
          value: description
        },
        {
          type: "Array",
          value: optionsToInvokeParams
        },
        {
          type: "Integer",
          value: start
        },
        {
          type: "Integer",
          value: end
        }
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, contractHash]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  vote = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    decimals: string,
    proposalNo: string,
    optionIndex: string,
    voteAmount: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "vote",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "Integer",
          value: proposalNo
        },
        {
          type: "Integer",
          value: optionIndex
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(
            voteAmount,
            parseFloat(decimals)
          ).toString()
        }
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, contractHash]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  withdrawProposalFund = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    proposalNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "closeProposal",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "Integer",
          value: proposalNo
        }
      ],
      // signers: [
      //   {
      //     account: senderHash,
      //     scopes: tx.WitnessScope.CustomContracts,
      //     allowedContracts: [this.contractHash, contractHash],
      //   },
      // ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  withdrawVoteFund = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    proposalNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "closeVotes",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "Integer",
          value: proposalNo
        }
      ],
      // signers: [
      // 	{
      // 		account: senderHash,
      // 		scopes: tx.WitnessScope.CustomContracts,
      // 		allowedContracts: [this.contractHash, contractHash],
      // 	},
      // ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getChannels = async (perPage: string, page: string) => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getChannels",
      args: [
        { type: "Integer", value: perPage },
        { type: "Integer", value: page }
      ]
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseChannelsPaginate(res.stack[0]);
  };

  getChannel = async (contractHash: string): Promise<IChannel> => {
    const script1 = {
      scriptHash: this.contractHash,
      operation: "getChannel",
      args: [{ type: "Hash160", value: contractHash }]
    };
    const res = await Network.read(this.network, [script1]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      ...parseMapValue(res.stack[0] as any)
    };
  };

  getProposals = async (
    contractHash: string,
    perPage: string,
    page: string
  ) => {
    const script1 = {
      scriptHash: this.contractHash,
      operation: "getProposals",
      args: [
        { type: "Hash160", value: contractHash },
        { type: "Integer", value: perPage },
        { type: "Integer", value: page }
      ]
    };
    const script2 = {
      scriptHash: this.contractHash,
      operation: "getChannel",
      args: [{ type: "Hash160", value: contractHash }]
    };
    const res = await Network.read(this.network, [script1, script2]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      proposals: parseMapValue(res.stack[0] as any),
      channel: parseMapValue(res.stack[1] as any)
    };
  };

  getProposal = async (
    contractHash: string,
    proposalNo: string,
    connectedWallet
  ): Promise<IProposal> => {
    const script1 = {
      scriptHash: this.contractHash,
      operation: "getProposal",
      args: [
        { type: "Hash160", value: contractHash },
        { type: "Integer", value: proposalNo }
      ]
    };
    const script2 = {
      scriptHash: this.contractHash,
      operation: "getChannel",
      args: [{ type: "Hash160", value: contractHash }]
    };

    const scripts = [script1, script2];

    if (connectedWallet) {
      const senderHash = NeonWallet.getScriptHashFromAddress(
        connectedWallet.account.address
      );
      scripts.push({
        scriptHash: contractHash,
        operation: "balanceOf",
        args: [{ type: "Hash160", value: senderHash }]
      });
    }

    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    const proposal = parseMapValue(res.stack[0] as any);
    const channel = parseMapValue(res.stack[1] as any);
    const balance = connectedWallet
      ? parseFloat(res.stack[2].value as string)
      : 0;
    return {
      proposal,
      channel,
      balance
    };
  };

  getVotes = async (
    contractHash: string,
    proposalNo: string,
    perPage: string,
    page: string
  ) => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getVotes",
      args: [
        { type: "Hash160", value: contractHash },
        { type: "Integer", value: proposalNo },
        { type: "Integer", value: perPage },
        { type: "Integer", value: page }
      ]
    };

    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getUserVotes = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    proposalNo: string,
    perPage: string,
    page: string
  ) => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const script = {
      scriptHash: this.contractHash,
      operation: "getUserVotes",
      args: [
        { type: "Hash160", value: contractHash },
        { type: "Hash160", value: senderHash },
        { type: "Integer", value: proposalNo },
        { type: "Integer", value: perPage },
        { type: "Integer", value: page }
      ]
    };

    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  hasPermission = async (
    connectedWallet: IConnectedWallet,
    contractHash: string
  ): Promise<{ hasPermission: boolean; symbol: string; decimals: string }> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const script1 = {
      scriptHash: this.contractHash,
      operation: "hasPermission",
      args: [
        { type: "Hash160", value: contractHash },
        { type: "Hash160", value: senderHash }
      ]
    };
    const script2 = {
      scriptHash: contractHash,
      operation: "symbol",
      args: []
    };
    const script3 = {
      scriptHash: contractHash,
      operation: "decimals",
      args: []
    };

    const res = await Network.read(this.network, [script1, script2, script3]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      hasPermission: res.stack[0].value as boolean,
      symbol: base64ToString(res.stack[1].value as string),
      decimals: res.stack[2].value as string
    };
  };
  static getMetadata = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  };
}

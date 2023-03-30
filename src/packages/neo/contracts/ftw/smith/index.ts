import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { wallet } from "../../../index";
import { DEFAULT_WITNESS_SCOPE, MAINNET } from "../../../consts";
import { SMITH_SCRIPT_HASH } from "./consts";
import {
  ISmithNEP11Info,
  ISmithNEP11RecordPaginate,
  ISmithNEP17Info,
  ISmithNEP17RecordPaginate
} from "./interfaces";
import { parseSmithProperties } from "./helpers";
import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { IRuneMeta } from "../rune/interfaces";
import { parseMapValue } from "../../../utils";
import {
  GAS_SCRIPT_HASH,
  NEP_SCRIPT_HASH
} from "../../../consts/neo-token-hashes";

export class SmithContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = SMITH_SCRIPT_HASH[networkType];
  }

  createNEP17V3 = async (
    connectedWallet: IConnectedWallet,
    totalSupply: string,
    decimals: string,
    symbol: string,
    contractName: string,
    author: string,
    description: string,
    email: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "createNEP17",
      scriptHash: this.contractHash,
      args: [
        {
          type: "String",
          value: "v3"
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "Integer",
          value: totalSupply
        },
        {
          type: "Integer",
          value: decimals
        },
        {
          type: "String",
          value: symbol
        },
        {
          type: "String",
          value: contractName
        },
        {
          type: "String",
          value: author
        },
        {
          type: "String",
          value: description
        },
        {
          type: "String",
          value: email
        }
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, NEP_SCRIPT_HASH[this.network]]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  createNEP17 = async (
    connectedWallet: IConnectedWallet,
    contractName: string,
    symbol: string,
    decimals: string,
    totalSupply: string,
    author: string,
    description: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "createNEP17",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "String",
          value: contractName
        },
        {
          type: "String",
          value: author
        },
        {
          type: "String",
          value: description
        },
        {
          type: "String",
          value: symbol
        },
        {
          type: "Integer",
          value: totalSupply
        },
        {
          type: "Integer",
          value: decimals
        }
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, NEP_SCRIPT_HASH[this.network]]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  createNEP11 = async (
    connectedWallet: IConnectedWallet,
    contractName: string,
    symbol: string,
    author: string,
    description: string,
    email: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "createNEP11",
      scriptHash: this.contractHash,
      args: [
        {
          type: "String",
          value: "v1"
        },
        {
          type: "Hash160",
          value: senderHash
        },
        {
          type: "String",
          value: symbol
        },
        {
          type: "String",
          value: contractName
        },
        {
          type: "String",
          value: description
        },
        {
          type: "String",
          value: author
        },
        {
          type: "String",
          value: email
        }
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, NEP_SCRIPT_HASH[this.network]]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  mintNFT = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    name: string,
    description: string,
    image: string,
    json
  ) => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "mintNFT",
      scriptHash: contractHash,
      args: [
        {
          type: "String",
          value: name
        },
        {
          type: "String",
          value: description
        },
        {
          type: "String",
          value: image
        },
        {
          type: "String",
          value: json
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  updateManifest = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    manifest: string
  ) => {
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
          type: "String",
          value: manifest
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  adminUpdate = async (
    connectedWallet: IConnectedWallet,
    contractHash: string,
    manifest: string
  ) => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );

    const invokeScript = {
      operation: "adminUpdateManifest",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        },
        {
          type: "String",
          value: manifest
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getNEP17Records = async (
    page: number
  ): Promise<ISmithNEP17RecordPaginate> => {
    const records = {
      operation: "getNEP17List",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Integer",
          value: "30"
        },
        {
          type: "Integer",
          value: page
        }
      ]
    };
    const res = await Network.read(this.network, [records]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getNEP11Records = async (
    page: number
  ): Promise<ISmithNEP11RecordPaginate> => {
    const records = {
      operation: "getNEP11List",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Integer",
          value: "30"
        },
        {
          type: "Integer",
          value: page
        }
      ]
    };
    const scripts = [records];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getTokens = async (contract): Promise<string[]> => {
    const script = {
      scriptHash: contract,
      operation: "tokens",
      args: []
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // @ts-ignore
    return res.stack[0].iterator.map((item) => {
      return u.HexString.fromBase64(item.value as string).toAscii();
    });
  };

  totalSupply = async (contract): Promise<number> => {
    const script = {
      scriptHash: contract,
      operation: "totalSupply",
      args: []
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseFloat(res.stack[0].value as string);
  };

  getProperties = async (
    contractHash: string,
    tokenId: string
  ): Promise<any> => {
    const script = {
      scriptHash: contractHash,
      operation: "properties",
      args: [
        {
          type: "String",
          value: tokenId
        }
      ]
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // return parseSmithProperties(res.stack) as IRuneMeta;
    return parseMapValue(res.stack[0] as any);
  };

  getNep17ContractInfo = async (
    contractHash: string
  ): Promise<ISmithNEP17Info> => {
    const script = {
      operation: "getNEP17",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        }
      ]
    };

    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getNep11ContractInfo = async (
    contractHash: string
  ): Promise<ISmithNEP11Info> => {
    const script = {
      operation: "getNEP11",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: contractHash
        }
      ]
    };

    const scripts = [script];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  isNEP17SymbolTaken = async (symbol: string): Promise<boolean> => {
    const script = {
      operation: "isNEP17TokenTaken",
      scriptHash: this.contractHash,
      args: [
        {
          type: "String",
          value: symbol
        }
      ]
    };

    const scripts = [script];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return res.stack[0].value as boolean;
  };

  isNEP11SymbolTaken = async (symbol: string): Promise<boolean> => {
    const script = {
      operation: "isNEP11TokenTaken",
      scriptHash: this.contractHash,
      args: [
        {
          type: "String",
          value: symbol
        }
      ]
    };

    const scripts = [script];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return res.stack[0].value as boolean;
  };

  balanceCheck = async (
    connectedWallet: IConnectedWallet
  ): Promise<{
    gasBalance: number;
    nepBalance: number;
  }> => {
    const ownerHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const script1 = {
      scriptHash: GAS_SCRIPT_HASH,
      operation: "balanceOf",
      args: [
        {
          type: "Hash160",
          value: ownerHash
        }
      ]
    };
    const script2 = {
      scriptHash: NEP_SCRIPT_HASH[this.network],
      operation: "balanceOf",
      args: [
        {
          type: "Hash160",
          value: ownerHash
        }
      ]
    };
    const res = await Network.read(this.network, [script1, script2]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      gasBalance: parseFloat(res.stack[0].value as string),
      nepBalance: parseFloat(res.stack[1].value as string)
    };
  };
}

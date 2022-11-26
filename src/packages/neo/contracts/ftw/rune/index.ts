import { u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { DEFAULT_WITNESS_SCOPE} from "../../../consts";
import { INetworkType, Network } from "../../../network";
import { RUNE_SCRIPT_HASH, RUNE_PRICE } from "./consts";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { wallet } from "../../../index";
import { IRuneMeta } from "./interfaces";
import { parseProperties } from "./helpers";
import {GAS_SCRIPT_HASH} from "../../../consts/nep17-list";

export class NFTContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = RUNE_SCRIPT_HASH[networkType];
  }

  mint = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: GAS_SCRIPT_HASH,
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
          value: u.BigInteger.fromDecimal(
            RUNE_PRICE[this.network],
            8
          ).toString(),
        },
        {
          type: "String",
          value: "1",
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(
      connectedWallet,
      this.network,
      invokeScript,
      "0.01"
    );
  };

  withdrawFund = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "withdrawFund",
      scriptHash: this.contractHash,
      args: [],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getProperties = async (tokenId: string): Promise<IRuneMeta | null> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "properties",
      args: [
        {
          type: "String",
          value: tokenId,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      console.error(res.exception);
      return null;
    }
    return parseProperties(res.stack) as IRuneMeta;
  };

  // getTokensOfScript = (ownerAddress: string) => {
  //   return {
  //     scriptHash: this.contractHash,
  //     operation: "tokensOf",
  //     args: [
  //       {
  //         type: "Address",
  //         value: ownerAddress,
  //       },
  //     ],
  //   };
  // };

  getTokensOf = async (ownerAddress: string): Promise<object[]> => {
	  const senderHash = NeonWallet.getScriptHashFromAddress(ownerAddress);
    const script = {
      scriptHash: this.contractHash,
      operation: "tokensOf",
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      console.error(res.exception);
      return [];
    }
    const metaList: object[] = [];
    // @ts-ignore
    for await (const item of res.stack[0].iterator) {
      const tokenId = u.HexString.fromBase64(item.value as string).toAscii();
      const meta = await this.getProperties(tokenId);
      if (meta) {
        metaList.push({ tokenId, ...meta });
      }
    }
    return metaList;
  };

  getTokens = async (): Promise<string[]> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "tokens",
      args: [],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      console.error(res.exception);
      return [];
    }
    // @ts-ignore
    return res.stack[0].iterator.map((item) => {
      return u.HexString.fromBase64(item.value as string).toAscii();
    });
  };
}
export { RUNE_SCRIPT_HASH } from "./consts";

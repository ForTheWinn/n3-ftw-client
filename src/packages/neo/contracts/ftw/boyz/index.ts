import { INetworkType, Network } from "../../../network";
import { BOYZ_SCRIPT_HASH } from "./consts";
import { IBoy } from "./interface";
import { parseMapValue } from "../../../utils";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { wallet as NeonWallet } from "@cityofzion/neon-core";

export class BoyzContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = BOYZ_SCRIPT_HASH[networkType];
  }

  getProperties = async (tokenId: string): Promise<IBoy | null> => {
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
      throw new Error("Failed");
    }
    return parseMapValue(res.stack[0] as any);
  };

  getTokens = async (connectedWallet?: IConnectedWallet): Promise<string[]> => {
    if (!connectedWallet) return [];
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
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
    const tokensOfRes: any = await Network.read(this.network, [script]);
    const sessionId = tokensOfRes.session;
    const id = tokensOfRes.stack[0].id;
    return (await Network.traverseIterator(
      this.network,
      sessionId,
      id
    )) as string[];
  };
}

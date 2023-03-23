import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { wallet } from "../../../index";
import { LOTTO_SCRIPT_HASH } from "./consts";
import { IReserve } from "../swap/interfaces";
import { parseMapValue } from "../../../utils";
import { GAS_SCRIPT_HASH } from "../../../consts/neo-token-hashes";

export class LottoContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = LOTTO_SCRIPT_HASH[networkType];
  }

  buy = async (connectedWallet: IConnectedWallet): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "buyTicket",
      scriptHash: this.contractHash,
      args: [],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [
            "6e644dda08a62f3fc9d14e824d1a3bd816a0c2d5",
            GAS_SCRIPT_HASH,
            this.contractHash
          ]
        }
      ]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getStatus = async (connectedWallet?: IConnectedWallet): Promise<any> => {
    const script = [
      {
        scriptHash: GAS_SCRIPT_HASH,
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: this.contractHash
          }
        ]
      }
    ];
    if (connectedWallet) {
      const senderHash = NeonWallet.getScriptHashFromAddress(
        connectedWallet.account.address
      );
      const script2 = {
        scriptHash: this.contractHash,
        operation: "isAddressParticipated",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      const script3 = {
        scriptHash: this.contractHash,
        operation: "getVotePrice",
        args: [
          {
            type: "Hash160",
            value: senderHash
          }
        ]
      };
      script.push(script2 as any);
      script.push(script3 as any);
    }

    const res = await Network.read(this.network, script);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      tickets: parseFloat(
        u.BigInteger.fromNumber(res.stack[0].value as string).toDecimal(8)
      ),
      isAddressParticipated: connectedWallet ? res.stack[1].value : undefined,
      votePrice: connectedWallet ? res.stack[2].value : undefined
    };
  };

  getTicketList = async () => {
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getTicketList",
        args: [
          { type: "Integer", value: "10" },
          { type: "Integer", value: "1" }
        ]
      }
    ];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // @ts-ignore
    return parseMapValue(res.stack[0]);
  };
}

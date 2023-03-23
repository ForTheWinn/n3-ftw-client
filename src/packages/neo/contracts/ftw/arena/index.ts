import { INetworkType, Network } from "../../../network";
import { SUPPORT_TICKET_PRICE, TOURNAMENT_SCRIPT_HASH } from "./consts";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { wallet } from "../../../index";
import { RUNE_SCRIPT_HASH } from "../rune";
import { parsePlayer, parseHistory } from "./helpers";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";
import { base64ToAddress, toDecimal } from "../../../utils";
import { u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { GAS_SCRIPT_HASH } from "../../../consts/neo-token-hashes";

export class TournamentContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = TOURNAMENT_SCRIPT_HASH[networkType];
  }

  register = async (
    connectedWallet: IConnectedWallet,
    tokenId: string,
    arenaNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: RUNE_SCRIPT_HASH[this.network],
      args: [
        {
          type: "Hash160",
          value: this.contractHash
        },
        {
          type: "String",
          value: tokenId
        },
        {
          type: "Array",
          value: [
            {
              type: "Integer",
              value: arenaNo
            }
          ]
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  play = async (
    connectedWallet: IConnectedWallet,
    arenaNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "play",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Integer",
          value: arenaNo
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(
      connectedWallet,
      this.network,
      invokeScript,
      "0.05"
    );
  };

  leave = async (
    connectedWallet: IConnectedWallet,
    tokenId: string,
    arenaNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "leave",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Integer",
          value: arenaNo
        },
        {
          type: "String",
          value: tokenId
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  remove = async (
    connectedWallet: IConnectedWallet,
    tokenId: string,
    arenaNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "remove",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Integer",
          value: arenaNo
        },
        {
          type: "String",
          value: tokenId
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  bet = async (
    connectedWallet: IConnectedWallet,
    tokenId: string,
    arenaNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: GAS_SCRIPT_HASH,
      args: [
        { type: "Hash160", value: senderHash },
        { type: "Hash160", value: this.contractHash },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(SUPPORT_TICKET_PRICE, 8).toString()
        },
        {
          type: "Array",
          value: [
            { type: "Integer", value: arenaNo },
            { type: "String", value: tokenId }
          ]
        }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  claim = async (
    connectedWallet: IConnectedWallet,
    arenaNo: string,
    gameNo: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "claim",
      scriptHash: this.contractHash,
      args: [
        { type: "Integer", value: arenaNo },
        { type: "Integer", value: gameNo }
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)]
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getPlayers = async (arenaNo: string): Promise<object[]> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getPlayers",
      args: [
        {
          type: "Integer",
          value: arenaNo
        }
      ]
    };
    const res = await Network.read(this.network, [script]);
    // @ts-ignore
    return parsePlayer(res.stack[0].value);
  };

  history = async (arenaNo: string, page: number): Promise<object> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getHistoryPaginate",
      args: [
        { type: "Integer", value: arenaNo },
        { type: "Integer", value: page }
      ]
    };
    const res = await Network.read(this.network, [script]);
    return parseHistory(res.stack[0].value);
  };

  getGameHeight = async (arenaNo: string): Promise<object> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getGameHeight",
      args: [{ type: "Integer", value: arenaNo }]
    };
    const res = await Network.read(this.network, [script]);
    // @ts-ignore
    return res.stack[0].value;
  };

  getBetAmount = async (
    arenaNo: string,
    gameNo: string,
    championTokenId: string,
    address: string
  ): Promise<any> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(address);

    const script = {
      scriptHash: this.contractHash,
      operation: "getBetsOnAccount",
      args: [
        { type: "Integer", value: arenaNo },
        { type: "Integer", value: gameNo },
        { type: "String", value: championTokenId },
        { type: "Hash160", value: senderHash }
      ]
    };
    const script1 = {
      scriptHash: this.contractHash,
      operation: "isClaimed",
      args: [
        { type: "Integer", value: arenaNo },
        { type: "Integer", value: gameNo },
        { type: "Hash160", value: address }
      ]
    };
    const res = await Network.read(this.network, [script, script1]);
    return {
      // @ts-ignore
      betAmount: parseFloat(res.stack[0].value),
      // @ts-ignore
      isClaimed: res.stack[1].value
    };
  };

  getBetOnPlayer = async (
    arenaNo: string,
    gameNo: string,
    tokenId: string,
    address: string
  ): Promise<{
    totalBets: string;
    userBets: string;
  }> => {
    const scripts: any = [];
    const script = {
      scriptHash: this.contractHash,
      operation: "getBetsOnPlayer",
      args: [
        { type: "Integer", value: arenaNo },
        { type: "Integer", value: gameNo },
        { type: "String", value: tokenId }
      ]
    };
    scripts.push(script);

    if (address) {
      const senderHash = NeonWallet.getScriptHashFromAddress(address);
      const script1 = {
        scriptHash: this.contractHash,
        operation: "getBetsOnAccount",
        args: [
          { type: "Integer", value: arenaNo },
          { type: "Integer", value: gameNo },
          { type: "String", value: tokenId },
          { type: "Hash160", value: senderHash }
        ]
      };
      scripts.push(script1);
    }
    const res = await Network.read(this.network, scripts);
    return {
      totalBets: res.stack[0].value as string,
      userBets: res.stack[1] ? (res.stack[1].value as string) : ""
    };
  };

  getCurrentPrize = async (
    arenaNo: string
  ): Promise<{
    prize: number;
    gameNo: number;
    previousChampWallet?: string;
    timeElapsedFromPreviousGame?: string;
  }> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getCurrentPrize",
      args: [{ type: "Integer", value: arenaNo }]
    };
    const script1 = {
      scriptHash: this.contractHash,
      operation: "getGameHeight",
      args: [{ type: "Integer", value: arenaNo }]
    };
    const script2 = {
      scriptHash: this.contractHash,
      operation: "getPreviousWinner",
      args: [{ type: "Integer", value: arenaNo }]
    };
    const script3 = {
      scriptHash: this.contractHash,
      operation: "getTimeElapsed",
      args: [{ type: "Integer", value: arenaNo }]
    };
    const res = await Network.read(this.network, [
      script,
      script1,
      script2,
      script3
    ]);
    return {
      prize: toDecimal(res.stack[0].value as string),
      gameNo: parseFloat(res.stack[1].value as string) + 1,
      previousChampWallet: res.stack[2].value
        ? base64ToAddress(res.stack[2].value as string)
        : undefined,
      timeElapsedFromPreviousGame: res.stack[3].value
        ? (res.stack[3].value as string)
        : undefined
    };
  };
}

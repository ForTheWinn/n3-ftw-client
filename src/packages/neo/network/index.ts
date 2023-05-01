import { rpc, sc, u } from "@cityofzion/neon-core";
import { MAINNET_CONFIG, TESTNET_CONFIG, TESTNET_CONFIG_2 } from "../consts";
import { InvokeResult, Query } from "@cityofzion/neon-core/lib/rpc";
import { ApplicationLogJson } from "@cityofzion/neon-core/lib/rpc/Query";
import { convertContractCallParam } from "../utils";
import { MAINNET, TESTNET } from "../../../consts/global";

export type INetworkType = typeof MAINNET | typeof TESTNET;

export const MAX_RPC_RESULT = 10000;

export class Network {
  private static readonly READ_LOG_FREQUENCY = 6000;

  static getRPCClient = (networkType: INetworkType) => {
    let config;
    switch (networkType) {
      case TESTNET:
        config = TESTNET_CONFIG;
        break;
      case MAINNET:
        config = MAINNET_CONFIG;
        break;
    }
    return new rpc.RPCClient(config.url);
  };

  static getRawTx = async (txid: string, networkType: INetworkType) => {
    let config;
    switch (networkType) {
      case TESTNET:
        config = TESTNET_CONFIG_2;
        break;
      case MAINNET:
        config = MAINNET_CONFIG;
        break;
    }
    const rpcClient = new rpc.RPCClient(config.url);
    let rawTx: any;
    do {
      try {
        rawTx = await rpcClient.getApplicationLog(txid);
      } catch (e) {
        await Network.sleep(Network.READ_LOG_FREQUENCY);
      }
    } while (!rawTx);

    return rawTx;
  };

  static getContactState = (networkType: INetworkType, scriptHash: string) => {
    const rpc = this.getRPCClient(networkType);
    return rpc.getContractState(scriptHash);
  };

  static findNotificationFromTxId = async (
    txId: string,
    scriptHash: string,
    eventName: string,
    networkType: INetworkType
  ) => {
    // Get transaction notifications
    const notifications = await Network.getNotificationsFromTxId(
      txId,
      networkType
    );
    // Return selected one
    return notifications.find(
      (n: any) => n.contract === scriptHash && n.eventname === eventName
    );
  };

  static getNotificationsFromTxId = async (
    txId: string,
    network: INetworkType
  ) => {
    // Get rpc client to do calls
    const rpcClient = Network.getRPCClient(network);

    // Cycle until i get app log to extract notifications from
    let appLog: ApplicationLogJson | undefined;
    do {
      try {
        appLog = await rpcClient.getApplicationLog(txId);
      } catch (e) {
        await Network.sleep(Network.READ_LOG_FREQUENCY);
      }
    } while (!appLog);

    // Get notifications from app log and return them
    const notifications = [] as any;
    appLog.executions.forEach((e) => {
      notifications.push(...e.notifications);
    });
    return notifications;
  };

  static read = async (
    network: INetworkType,
    scripts: sc.ContractCallJson[]
    // passFaultCheck?: boolean
  ): Promise<InvokeResult> => {
    const rpcClient = Network.getRPCClient(network);
    const sb = new sc.ScriptBuilder();
    scripts.map((script) => {
      let params: unknown[] = [];
      if (script.args) {
        params = script.args.map((arg) => convertContractCallParam(arg));
      }
      sb.emitAppCall(script.scriptHash, script.operation, params);
    });
    return rpcClient.invokeScript(u.HexString.fromHex(sb.build()));
  };

  static readOnly = async (
    network: INetworkType,
    scripts: sc.ContractCallJson[],
    parser: (res: InvokeResult) => any
  ): Promise<any | undefined> => {
    const rpcClient = Network.getRPCClient(network);
    const sb = new sc.ScriptBuilder();
    scripts.map((script) => {
      let params: unknown[] = [];
      if (script.args) {
        params = script.args.map((arg) => convertContractCallParam(arg));
      }
      sb.emitAppCall(script.scriptHash, script.operation, params);
    });
    const res = await rpcClient.invokeScript(u.HexString.fromHex(sb.build()));
    if (res.state === "FAULT") {
      console.error(res.exception);
      return undefined;
    }
    return parser(res);
  };

  // traverseIterator is using only for get result of tokensOf (it return iterator)
  // therefore, return result as string[] which contain tokenId
  static traverseIterator = async (
    network: INetworkType,
    sessionId: string,
    id: string
  ): Promise<string[]> => {
    const rpcClient = Network.getRPCClient(network);
    const traverseIteratorQuery = {
      method: "traverseiterator",
      params: [sessionId, id, MAX_RPC_RESULT]
    };
    let rpcRes: any[] = [];
    try {
      // neon-core 5.2.0 don't have support for traverseiterator.
      // used execute with custom method instead
      rpcRes = await rpcClient.execute(new Query(traverseIteratorQuery));
    } catch (e: any) {
      // in case that node support lower than MAX_RPC_RESULT, it will throw error.
      // set count to default of 100 then re-execute.
      if (e.message.includes("count")) {
        traverseIteratorQuery.params[2] = 100;
        rpcRes = await rpcClient.execute(new Query(traverseIteratorQuery));
      }
    }

    const tokenIdList: string[] = [];
    if (rpcRes.length > 0) {
      // @ts-ignore
      for (const item of rpcRes) {
        const tokenId = u.HexString.fromBase64(item.value as string).toAscii();
        tokenIdList.push(tokenId);
      }
    }
    return tokenIdList;
  };

  static queryTraverseIterator = async (
    network: INetworkType,
    sessionId: string,
    id: string
  ): Promise<any[]> => {
    const rpcClient = Network.getRPCClient(network);
    const traverseIteratorQuery = {
      method: "traverseiterator",
      params: [sessionId, id, MAX_RPC_RESULT]
    };
    let rpcRes: any[] = [];
    try {
      rpcRes = await rpcClient.execute(new Query(traverseIteratorQuery));
    } catch (e: any) {
      if (e.message.includes("count")) {
        traverseIteratorQuery.params[2] = 100;
        rpcRes = await rpcClient.execute(new Query(traverseIteratorQuery));
      }
    }

    return rpcRes;
  };

  static sleep = (duration: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };
}

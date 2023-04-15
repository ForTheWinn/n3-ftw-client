import { CONST, rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";
// tslint:disable-next-line:no-submodule-imports
import { BigInteger } from "@cityofzion/neon-core/lib/u";
import { INetworkType, Network } from "../network";
import { IBalance } from "./interfaces";
import { convertContractCallParam } from "../utils";
import { GAS_SCRIPT_HASH, NEO_SCRIPT_HASH } from "../consts/neo-contracts";

export class DevWallet {
  static account = new wallet.Account("");
  static async getAccount() {
    return {
      address: DevWallet.account.address,
      label: "DEV"
    };
  }

  static async getProvider() {
    return {
      name: "Dev wallet",
      version: "0.0",
      website: "https://",
      // @ts-ignore
      compatibility: [],
      extra: { currency: "USD", theme: "" }
    };
  }

  static async getNetworks(network: INetworkType) {
    return {
      chainId: 4,
      defaultNetwork: network,
      networks: ["MainNet", "TestNet", "N3MainNet", "N3TestNet"]
    };
  }

  /* Convert balance as neoline does */
  static async getBalance(network: INetworkType) {
    const rpcClient = Network.getRPCClient(network);
    const res = await rpcClient.getNep17Balances(DevWallet.account.address);
    const balances: IBalance[] = [];
    res.balance.forEach((item) => {
      let symbol;
      let amount;
      if (item.assethash.includes(GAS_SCRIPT_HASH)) {
        symbol = "GAS";
        amount = u.BigInteger.fromNumber(item.amount).toDecimal(8).toString();
      }
      if (item.assethash.includes(NEO_SCRIPT_HASH)) {
        symbol = "NEO";
        amount = item.amount;
      }
      balances.push({
        contract: item.assethash,
        amount,
        symbol
      });
    });
    return balances;
  }

  static async invoke(
    invokeScript: sc.ContractCallJson & {
      extraSystemFee?: string;
      signers: any[];
    },
    network: INetworkType
  ) {
    const rpcClient = Network.getRPCClient(network);
    const version: any = await rpcClient.getVersion();
    const txObj = await DevWallet.build(rpcClient, invokeScript);
    txObj.sign(DevWallet.account, version.protocol.network);
    const txid = await rpcClient.sendRawTransaction(txObj);
    // // tslint:disable-next-line:no-console
    //   JSON.stringify(
    //     {
    //       RPC: rpc,
    //       Transaction: txObj,
    //       Network: version,
    //       "Network Fee": txObj.networkFee.toDecimal(8).toString(),
    //       "System Fee": txObj.systemFee.toDecimal(8).toString(),
    //     },
    //     null,
    //     4
    //   )
    // );
    return {
      txid,
      nodeUrl: rpcClient.url
    };
  }

  static createScript = (invokeScript: sc.ContractCallJson) => {
    return sc.createScript({
      scriptHash: invokeScript.scriptHash,
      operation: invokeScript.operation,
      args: invokeScript.args
        ? invokeScript.args.map((param: any) => convertContractCallParam(param))
        : []
    });
  };

  static build = async (
    rpcClient: rpc.RPCClient,
    invokeScript: sc.ContractCallJson & {
      extraSystemFee?: string;
      signers: any[];
    }
    // cosignerAddress?: string
  ): Promise<tx.Transaction> => {
    const currentHeight = await rpcClient.getBlockCount();

    const script = this.createScript(invokeScript);

    // if (cosignerAddress) {
    //   signers.push({
    //     account: wallet.getScriptHashFromAddress(cosignerAddress),
    //     scopes: tx.WitnessScope.Global,
    //   });
    // }

    const transaction = new tx.Transaction({
      validUntilBlock: currentHeight + 1,
      script,
      signers: invokeScript.signers
    });

    transaction.networkFee = await DevWallet.calculateNetworkFee(
      rpcClient,
      transaction
    );
    const systemFee = await DevWallet.calculateSystemFee(
      rpcClient,
      transaction
    );
    transaction.systemFee = systemFee;
    if (invokeScript.extraSystemFee) {
      const fee = u.BigInteger.fromDecimal(
        invokeScript.extraSystemFee,
        8
      ).toString();
      transaction.systemFee = systemFee.add(parseFloat(fee));
    }
    //
    // if (cosigner) {
    //   transaction.sign(cosigner, version.network);
    // }
    /* Temporary hard coding to solve NeonJS ordering bug */
    // if (
    //   transaction.witnesses[0].scriptHash !== sender.scriptHash &&
    //   signers.length > 1
    // ) {
    //   let sig1 = transaction.witnesses[0];
    //   let sig2 = transaction.witnesses[1];
    //   transaction.witnesses[1] = sig1;
    //   transaction.witnesses[0] = sig2;
    // }
    return transaction;
  };

  static calculateNetworkFee = async (
    rpcClient: rpc.RPCClient,
    transaction: tx.Transaction
  ): Promise<BigInteger> => {
    const invokeFunctionResponse = await rpcClient.invokeFunction(
      CONST.NATIVE_CONTRACT_HASH.PolicyContract,
      "getFeePerByte"
    );

    if (invokeFunctionResponse.state !== "HALT") {
      throw new Error(
        invokeFunctionResponse.exception
          ? invokeFunctionResponse.exception
          : "Failed"
      );
    }

    const feePerByte = u.BigInteger.fromNumber(
      // @ts-ignore
      invokeFunctionResponse.stack[0].value
    );
    // Account for witness size
    const transactionByteSize = transaction.serialize().length / 2 + 109;
    // Hardcoded. Running a witness is always the same cost for the basic account.
    const witnessProcessingFee = u.BigInteger.fromNumber(
      // In case of cosigner, check signer length check and mul the fee.
      1000390 * (transaction.signers.length === 1 ? 1 : 3)
    );

    return feePerByte.mul(transactionByteSize).add(witnessProcessingFee);
  };

  static calculateSystemFee = async (
    rpcClient: rpc.RPCClient,
    transaction: tx.Transaction
  ) => {
    const invokeFunctionResponse = await rpcClient.invokeScript(
      transaction.script,
      transaction.signers
    );
    if (invokeFunctionResponse.state !== "HALT") {
      throw new Error(
        invokeFunctionResponse.exception
          ? invokeFunctionResponse.exception
          : "Failed"
      );
    }

    return u.BigInteger.fromNumber(invokeFunctionResponse.gasconsumed);
  };
}

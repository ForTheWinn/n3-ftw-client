import { IConnectedWallet, ITransaction, IWalletType } from "./interfaces";
import { MAINNET, NEO_LINE, NEON, O3, ONE_GATE, WALLET_LIST } from "../consts";
import { u, wallet } from "@cityofzion/neon-core";
import { INetworkType } from "../network";
import { LocalStorage } from "../local-storage";
import moment from "moment";
import { initNeoLine } from "./neoline";
import { initOG } from "./onegate";
import { initO3 } from "./o3";
import { initNeon } from "./neon";

export class WalletAPI {
  static list = WALLET_LIST;

  static init = async (
    walletType: IWalletType,
    network: INetworkType
  ): Promise<IConnectedWallet> => {
    let instance;
    switch (walletType) {
      case O3:
        instance = await initO3();
        break;
      case NEO_LINE:
        instance = await initNeoLine();
        break;
      case NEON:
        instance = await initNeon(network);
        break;
      case ONE_GATE:
        instance = await initOG();
        break;
    }
    return {
      key: walletType,
      ...instance,
    };
  };

  /* Control signing and send transaction. TODO:Need to improve type hardcoding later */
  static invoke = async (
    connectedWallet: IConnectedWallet,
    currentNetwork: INetworkType,
    invokeScript: any,
    extraSystemFee?: string
  ): Promise<string> => {
    const instance = connectedWallet.instance;
    const walletType = connectedWallet.key;
    if (connectedWallet.key === NEON) {
      const res = await instance.invokeFunction(
        invokeScript,
        invokeScript.signers
      );
      if (res && res.result.error) {
        throw new Error(res.result.error.message);
      }
      const submittedTx: ITransaction = {
        network: currentNetwork,
        wallet: walletType,
        txid: res.result,
        contractHash: invokeScript.scriptHash,
        method: invokeScript.operation,
        args: invokeScript.args,
        createdAt: moment().format("lll"),
      };
      LocalStorage.addTransaction(submittedTx);
      return res.result;
    } else {
      if (
        connectedWallet.network &&
        connectedWallet.network.defaultNetwork !== currentNetwork
      ) {
        throw new Error(
          "Your wallet's network doesn't match with the app network setting."
        );
      }

      if (extraSystemFee) {
        if (walletType === ONE_GATE) {
          invokeScript.extraSystemFee = u.BigInteger.fromDecimal(
            extraSystemFee,
            8
          ).toString();
        } else {
          invokeScript.extraSystemFee = extraSystemFee;
        }
      }

      // Hard coding for OG wallet
      if (walletType === ONE_GATE) {
        invokeScript.args = invokeScript.args.map((param: any) => {
          if (param.type === "Address") {
            return {
              type: "Hash160",
              value: wallet.getScriptHashFromAddress(param.value),
            };
          } else {
            return param;
          }
        });
      }

      const res = await instance.invoke(invokeScript, currentNetwork);
      const submittedTx: ITransaction = {
        network: instance.network ? instance.network.defaultNetwork : MAINNET,
        wallet: walletType,
        txid: res.txid,
        contractHash: invokeScript.scriptHash,
        method: invokeScript.operation,
        args: invokeScript.args,
        createdAt: moment().format("lll"),
      };
      LocalStorage.addTransaction(submittedTx);
      return res.txid;
    }
  };

  // invokeMulti = async (
  //   currentNetwork: INetworkType,
  //   invokeScript: any
  // ): Promise<any> => {
  //   const { instance, network } = await this.init();
  //   if (network.defaultNetwork !== currentNetwork) {
  //     throw new Error(
  //       "Your wallet's network doesn't match with the app network setting."
  //     );
  //   }
  //   try {
  //     const res = await instance.invokeMultiple(invokeScript);
  //     const submittedTx: ITransaction = {
  //       network,
  //       wallet: this.walletType,
  //       txid: res.txid,
  //       contractHash: "MultiInvoke",
  //       method: "MultiInvoke",
  //       args: invokeScript.invokeArgs,
  //       createdAt: moment().format("lll"),
  //     };
  //     LocalStorage.addTransaction(submittedTx);
  //     return res.txid;
  //   } catch (e: any) {
  //     if (e.description) {
  //       throw new Error(e.description);
  //     }
  //   }
  // };
}

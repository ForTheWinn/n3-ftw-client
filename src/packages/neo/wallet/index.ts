import { IConnectedWallet, ITransaction, IWalletType } from "./interfaces";
import { NEO_LINE, NEON, O3, ONE_GATE, WALLET_LIST } from "../consts";
import { u } from "@cityofzion/neon-core";
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

		if (
      connectedWallet.network &&
      connectedWallet.network.defaultNetwork &&
      connectedWallet.network.defaultNetwork !== currentNetwork
    ) {
      throw new Error(
        "Your wallet's network doesn't match with the app network setting."
      );
    }

    const instance = connectedWallet.instance;
    const walletType = connectedWallet.key;

    const submittedTx: ITransaction = {
      network: currentNetwork,
      wallet: walletType,
      txid: "",
      contractHash: invokeScript.scriptHash,
      method: invokeScript.operation,
      args: invokeScript.args,
      createdAt: moment().format("lll"),
    };

    if (connectedWallet.key === NEON) {

      const invocations = [invokeScript];
      const signers = invokeScript.signers;
      const res = await instance.invokeFunction({ invocations, signers });
			console.log(res)
	    submittedTx.txid = res;

    } else {

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

      const res = await instance.invoke(invokeScript, currentNetwork);
	    submittedTx.txid = res.txid;
    }

	  LocalStorage.addTransaction(submittedTx);
	  return submittedTx.txid;
  };

  /* Control signing and send transaction. TODO:Need to improve type hardcoding later */
  static invokeMulti = async (
    connectedWallet: IConnectedWallet,
    currentNetwork: INetworkType,
    invokeArgs: object[],
    signers: object[]
  ): Promise<string> => {
    console.log("multi");

    if (
      connectedWallet.network &&
      connectedWallet.network.defaultNetwork &&
      connectedWallet.network.defaultNetwork !== currentNetwork
    ) {
      throw new Error(
        "Your wallet's network doesn't match with the app network setting."
      );
    }

    const instance = connectedWallet.instance;
    const walletType = connectedWallet.key;

    const submittedTx: ITransaction = {
      network: currentNetwork,
      wallet: walletType,
      txid: "",
      contractHash: "multiple",
      method: "multiple",
      args: [],
      invokeScript: invokeArgs,
      createdAt: moment().format("lll"),
    };

    if (connectedWallet.key === NEON) {
      /**
			NEON
			 */
      submittedTx.txid = await instance.invokeFunction({
        invocations: invokeArgs,
        signers,
      });
    } else if (connectedWallet.key === NEO_LINE) {
      /**
		Neo Line
		 */
      const res = await instance.invokeMultiple({
        invokeArgs,
        signers,
      });
      submittedTx.txid = res.txid;
    } else if (connectedWallet.key === ONE_GATE) {
      /**
		OG
	     */
      const res = await instance.invokeMultiple({
        invocations: invokeArgs,
        signers,
      });
      submittedTx.txid = res.txid;
    } else {
      /**
		 O3
	     */
      const invokeRes = await instance.invokeMulti({
        invokeArgs,
        signers,
        network: currentNetwork,
      });
      submittedTx.txid = invokeRes.txid;
    }

    LocalStorage.addTransaction(submittedTx);
    return submittedTx.txid;
  };
}

import { ETH_WALLET_LIST, META_MASK } from "./consts";
import { IConnectedETHWallet, IETHWalletType } from "../neo/wallet/interfaces";
import { metaMask } from "./connectors/metaMask";
import { useWeb3React } from "@web3-react/core";
import { getKey } from "./utils";

export class ETHWalletAPI {
  static list = ETH_WALLET_LIST;

  static getConnector = () => {
    const { connector, account, accounts, isActive, isActivating, provider, hooks } = useWeb3React();
    const connectorName = getKey(connector);

    console.log(connectorName);
    console.log(account);
    console.log(accounts);
    console.log(isActivating);
    console.log(isActive);
    console.log(provider);
    console.log(hooks.usePriorityAccount());
  };

  static connect = async (walletType: IETHWalletType): Promise<void> => {
    switch (walletType) {
      case META_MASK:
        await metaMask.activate();
        break;
    }
  };

  /* Control signing and send transaction. TODO:Need to improve type hardcoding later */
  static invoke = async (
    connectedETHWallet: IConnectedETHWallet,
    // currentNetwork: INetworkType,
    invokeScript: any,
    extraSystemFee?: string
  ): Promise<any> => {
    // if (
    // 	connectedWallet.network &&
    // 	connectedWallet.network.defaultNetwork &&
    // 	connectedWallet.network.defaultNetwork !== currentNetwork
    // ) {
    // 	throw new Error(
    // 		"Your wallet's network doesn't match with the app network setting."
    // 	);
    // }
    //
    // const instance = connectedWallet.instance;
    // const walletType = connectedWallet.key;
    //
    // const submittedTx: ITransaction = {
    // 	network: currentNetwork,
    // 	wallet: walletType,
    // 	txid: "",
    // 	contractHash: invokeScript.scriptHash,
    // 	method: invokeScript.operation,
    // 	args: invokeScript.args,
    // 	createdAt: moment().format("lll"),
    // };
    //
    // if (connectedWallet.key === NEON) {
    //
    // 	const invocations = [invokeScript];
    // 	const signers = invokeScript.signers;
    // 	const res = await instance.invokeFunction({ invocations, signers });
    // 	submittedTx.txid = res;
    //
    // } else {
    //
    // 	if (extraSystemFee) {
    // 		if (walletType === ONE_GATE) {
    // 			invokeScript.extraSystemFee = u.BigInteger.fromDecimal(
    // 				extraSystemFee,
    // 				8
    // 			).toString();
    // 		} else {
    // 			invokeScript.extraSystemFee = extraSystemFee;
    // 		}
    // 	}
    //
    // 	const res = await instance.invoke(invokeScript, currentNetwork);
    // 	submittedTx.txid = res.txid;
    // }
    //
    // LocalStorage.addTransaction(submittedTx);
    // return submittedTx.txid;
  };
}

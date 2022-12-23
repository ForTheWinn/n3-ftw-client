import { ContextOptions, IWalletStates } from "./interfaces";
import React, { createContext, useContext, useState } from "react";
import { IConnectedWallet, IWalletType } from "../neo/wallet/interfaces";
import { sc } from "@cityofzion/neon-core";
import { WalletAPI } from "../neo/wallet";
import toast from "react-hot-toast";
import { INetworkType } from "../neo/network";
import { NEON } from "../neo/consts";
import { handleError } from "../neo/utils/errors";

export const WalletContext = createContext({} as IWalletStates);
export const WalletContextProvider = (props: {
  options: ContextOptions;
  children: any;
}) => {
	console.log(process.env.REACT_APP_NETWORK)
  const [network, setNetwork] = useState(process.env.REACT_APP_NETWORK as INetworkType);
  const [totalTxSubmit, setTotalTxSubmit] = useState(0);

  const [isWalletModalActive, setWalletModalActive] = useState(false);

  const [connectedWallet, setConnectedWallet] = useState<
    IConnectedWallet | undefined
  >(undefined);

  const [invokeScript, setInvokeScript] = useState<
    sc.ContractCallJson | undefined
  >();

  const [pendingTransactions, setPendingTransactions] = useState<string[]>([]);

  const openWalletModal = () => setWalletModalActive(true);

  const closeWalletModal = () => setWalletModalActive(false);

  const connectWallet = async (walletType: IWalletType) => {
    try {
      const res = await WalletAPI.init(walletType, network);
      setConnectedWallet(res);
      setWalletModalActive(false);
      toast.success("Wallet connected");
    } catch (e: any) {
      toast.error(handleError(e));
    }
  };

  const disConnectWallet = () => {
    setConnectedWallet(undefined);
    if (connectedWallet && connectedWallet.key === NEON) {
      connectedWallet.instance.disconnect();
    }
    toast.error("Wallet disconnected");
  };

  const doInvoke = (args: sc.ContractCallJson) => {
    if (isWalletModalActive) setWalletModalActive(false);
    setInvokeScript(args);
  };

  const closeInvoke = () => setInvokeScript(undefined);

  const addPendingTransaction = (txid: string) => {
    setPendingTransactions([...pendingTransactions, txid]);
  };

  const switchNetwork = (val: INetworkType) => {
    setConnectedWallet(undefined);
    setNetwork(val);
  };

  const removePendingTransaction = (txid: string) => {
    setPendingTransactions(pendingTransactions.filter((i) => i !== txid));
  };

  const increaseTotalTxSubmit = () => {
    setTotalTxSubmit(totalTxSubmit + 1);
  };

  const contextValue: IWalletStates = {
    useDevWallet: props.options.useDevWallet,
    network,
    invokeScript,
    list: WalletAPI.list,
    connectedWallet,
    isWalletModalActive,
    openWalletModal,
    closeWalletModal,
    connectWallet,
    disConnectWallet,
    doInvoke,
    closeInvoke,
    addPendingTransaction,
    removePendingTransaction,
    pendingTransactions,
    switchNetwork,
    totalTxSubmit,
    increaseTotalTxSubmit,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {props.children}
    </WalletContext.Provider>
  );
};
export const useWallet = () => useContext(WalletContext);

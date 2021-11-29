import { ContextOptions, IWalletStates } from "./interfaces";
import React, { createContext, useContext, useState } from "react";
import { IConnectedWallet, IWalletType } from "../neo/wallet/interfaces";
import { LocalStorage } from "../neo/local-storage";
import { sc } from "@cityofzion/neon-core";
import { WalletAPI } from "../neo/wallet";
import toast from "react-hot-toast";

export const WalletContext = createContext({} as IWalletStates);
export const WalletContextProvider = (props: {
  options: ContextOptions;
  children: any;
}) => {
  const [network] = useState(props.options.network);

  const [isWalletModalActive, setWalletModalActive] = useState(false);

  const [connectedWallet, setConnectedWallet] = useState<
    IConnectedWallet | undefined
  >(props.options.useLocalStorage ? LocalStorage.getWallet() : undefined);

  const [invokeScript, setInvokeScript] = useState<
    sc.ContractCallJson | undefined
  >();

  // const [transactions, setTransactions] = useState(
  //   props.options.useLocalStorage ? LocalStorage.initStorage(network) : []
  // );

  const [pendingTransactions, setPendingTransactions] = useState<string[]>([]);

  const openWalletModal = () => setWalletModalActive(true);

  const closeWalletModal = () => setWalletModalActive(false);

  const connectWallet = async (walletType: IWalletType) => {
    try {
      const res = await new WalletAPI(walletType).init(network);
      setConnectedWallet(res);
      if (props.options.useLocalStorage) {
        LocalStorage.setWallet(res);
      }
      setWalletModalActive(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const disConnectWallet = () => {
    LocalStorage.removeWallet();
    setConnectedWallet(undefined);
  };

  const doInvoke = (args: sc.ContractCallJson) => {
    if (isWalletModalActive) setWalletModalActive(false);
    setInvokeScript(args);
  };

  const closeInvoke = () => setInvokeScript(undefined);

  const addPendingTransaction = (txid: string) => {
    setPendingTransactions([...pendingTransactions, txid]);
  };

  const removePendingTransaction = (txid: string) => {
    setPendingTransactions(pendingTransactions.filter((i) => i !== txid));
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
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {props.children}
    </WalletContext.Provider>
  );
};
export const useWallet = () => useContext(WalletContext);

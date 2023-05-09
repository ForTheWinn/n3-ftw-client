import React, { createContext, useContext, useState } from "react";
import { CHAINS } from "../../consts/chains";
import { LocalStorage } from "../../packages/neo/local-storage";
import { INetworkType } from "../../packages/neo/network";
import { MAINNET } from "../../consts/global";

interface IAppContext {
  chain: CHAINS;
  network: INetworkType;
  switchChain: (chain: CHAINS) => void;
  sidebarStatus: boolean;
  walletSidebarStatus: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  toggleWalletSidebar: () => void;
  txid?: string;
  setTxid: (txid: string) => void;
  resetTxid: () => void;
  refreshCount: number;
  increaseRefreshCount: () => void;
}

export const AppContext = createContext({} as IAppContext);

export const AppContextProvider = (props: { children: any }) => {
  const [chain, setChain] = useState<CHAINS>(LocalStorage.getChain());
  const [network, setNetwork] = useState(
    (process.env.REACT_APP_NETWORK as INetworkType)
      ? (process.env.REACT_APP_NETWORK as INetworkType)
      : MAINNET
  );
  const [refreshCount, setRefreshCount] = useState(0);
  const [txid, setTxid] = useState<string | undefined>();
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [walletSidebarStatus, setWalletSidebarStatus] = useState(false);
  const openSidebar = () => setSidebarStatus(false);
  const closeSidebar = () => setSidebarStatus(false);
  const resetTxid = () => {
    setTxid(undefined);
    setRefreshCount(refreshCount + 1);
  };
  const toggleSidebar = () => {
    if (walletSidebarStatus) {
      setWalletSidebarStatus(false);
    }
    setSidebarStatus(!sidebarStatus);
  };
  const toggleWalletSidebar = () => {
    if (sidebarStatus) {
      setSidebarStatus(false);
    }
    setWalletSidebarStatus(!walletSidebarStatus);
  };
  const switchChain = (v: CHAINS) => {
    LocalStorage.setChain(v);
    setChain(v);
  };
  const increaseRefreshCount = () => setRefreshCount(refreshCount + 1);

  const contextValue = {
    chain,
    txid,
    network,
    refreshCount,
    walletSidebarStatus,
    sidebarStatus,
    switchChain,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    toggleWalletSidebar,
    setTxid,
    resetTxid,
    increaseRefreshCount
  };
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

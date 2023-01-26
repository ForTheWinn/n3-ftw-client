import React, { createContext, useContext, useState } from "react";
import { CHAINS, NEO_CHAIN } from "../../packages/chains/consts";

interface IAppContext {
  chain: CHAINS;
  switchChain: (chain: CHAINS) => void;
  sidebarStatus: boolean;
  walletSidebarStatus: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  toggleWalletSidebar: () => void;
}

export const AppContext = createContext({} as IAppContext);

export const AppCContextProvider = (props: { children: any }) => {
  const [chain, setChain] = useState<CHAINS>(NEO_CHAIN);
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [walletSidebarStatus, setWalletSidebarStatus] = useState(false);
  const openSidebar = () => setSidebarStatus(true);
  const closeSidebar = () => setSidebarStatus(false);
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
    setChain(v);
  };

  const contextValue = {
    chain,
    switchChain,
    sidebarStatus,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    walletSidebarStatus,
    toggleWalletSidebar,
  };
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

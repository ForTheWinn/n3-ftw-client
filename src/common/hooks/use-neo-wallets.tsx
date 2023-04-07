import React, { createContext, useContext, useState } from "react";
import {
  IConnectedWallet,
  IWalletType
} from "../../packages/neo/wallets/interfaces";
import { WalletAPI } from "../../packages/neo/wallets";
import toast from "react-hot-toast";
import { INetworkType } from "../../packages/neo/network";
import { NEON } from "../../packages/neo/consts";

export interface IWalletStates {
  list: {
    key: IWalletType;
    label: string;
  }[];
  connectedWallet?: IConnectedWallet;
  connectWallet: (
    network: INetworkType,
    wallet: IWalletType,
    onSuccess: () => void
  ) => void;
  disConnectWallet: () => void;
}

const NeoWalletContext = createContext({} as IWalletStates);
export const NeoWalletProvider = (props: { children: any }) => {
  const [connectedWallet, setConnectedWallet] = useState<
    IConnectedWallet | undefined
  >(undefined);

  const connectWallet = async (
    network: INetworkType,
    walletType: IWalletType,
    onSuccess: () => void
  ) => {
    try {
      const res = await WalletAPI.init(walletType, network);
      setConnectedWallet(res);
      toast.success("Connected!");
      onSuccess();
    } catch (e: any) {
      console.log(e);
      toast.error(
        e && e.message ? e.message : `Failed to connect ${walletType}.`
      );
    }
  };

  const disConnectWallet = () => {
    setConnectedWallet(undefined);
    if (connectedWallet && connectedWallet.key === NEON) {
      connectedWallet.instance.disconnect();
    }
    toast.error("Wallet disconnected");
  };

  const contextValue: IWalletStates = {
    list: WalletAPI.list,
    connectedWallet,
    connectWallet,
    disConnectWallet
  };

  return (
    <NeoWalletContext.Provider value={contextValue}>
      {props.children}
    </NeoWalletContext.Provider>
  );
};
export const useNeoWallets = () => useContext(NeoWalletContext);

import React, { useEffect } from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { NEO_LINE, O3 } from "../../../../../packages/neo/consts";
import neo3Dapi from "neo3-dapi";
import { Avatar } from "antd";
import { NEO_LOGO } from "../../../../../consts/global";

const NeoWalletConnected = ({ connectedWallet, style }) => {
  const { disConnectWallet } = useNeoWallets();

  useEffect(() => {
    // const refresh = () => {
    //   connectWallet(connectedWallet.key);
    // };

    const disconnected = () => {
      disConnectWallet();
    };

    if (connectedWallet && connectedWallet.key === NEO_LINE) {
      window.addEventListener(
        "NEOLine.NEO.EVENT.ACCOUNT_CHANGED",
        disconnected
      );
      window.addEventListener(
        "NEOLine.NEO.EVENT.NETWORK_CHANGED",
        disconnected
      );
      window.addEventListener("NEOLine.NEO.EVENT.DISCONNECTED", disconnected);
      return () => {
        window.removeEventListener(
          "NEOLine.NEO.EVENT.ACCOUNT_CHANGED",
          disconnected
        );
        window.removeEventListener(
          "NEOLine.NEO.EVENT.NETWORK_CHANGED",
          disconnected
        );
        window.removeEventListener(
          "NEOLine.NEO.EVENT.DISCONNECTED",
          disconnected
        );
      };
    }
    if (connectedWallet && connectedWallet.key === O3) {
      neo3Dapi.addEventListener(
        neo3Dapi.Constants.EventName.ACCOUNT_CHANGED,
        disconnected
      );

      neo3Dapi.addEventListener(
        neo3Dapi.Constants.EventName.NETWORK_CHANGED,
        disconnected
      );

      neo3Dapi.addEventListener(
        neo3Dapi.Constants.EventName.DISCONNECTED,
        disconnected
      );

      return () => {
        neo3Dapi.removeEventListener(
          neo3Dapi.Constants.EventName.ACCOUNT_CHANGED,
          disconnected
        );
        neo3Dapi.removeEventListener(
          neo3Dapi.Constants.EventName.NETWORK_CHANGED,
          disconnected
        );
        neo3Dapi.removeEventListener(
          neo3Dapi.Constants.EventName.DISCONNECTED,
          disconnected
        );
      };
    }
  }, [connectedWallet]);

  if (!connectedWallet) return <></>;
  return <Avatar src={NEO_LOGO} style={style} />;
};

export default NeoWalletConnected;

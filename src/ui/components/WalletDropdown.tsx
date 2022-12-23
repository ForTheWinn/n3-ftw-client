import React, { useEffect } from "react";
import { utils } from "../../packages/neo";
import { IConnectedWallet } from "../../packages/neo/wallet/interfaces";
import { useWallet } from "../../packages/provider";
import { useApp } from "../../common/hooks/use-app";
import { NEO_LINE, O3 } from "../../packages/neo/consts";
import neo3Dapi from "neo3-dapi";
interface IWalletDropdownProps {
  connectedWallet: IConnectedWallet;
}
const WalletDropdown = ({ connectedWallet }: IWalletDropdownProps) => {
  const { disConnectWallet } = useWallet();
  const { toggleWalletSidebar } = useApp();

  useEffect(() => {
    // const refresh = () => {
    //   connectWallet(connectedWallet.key);
    // };

    const disconnected = () => {
      console.log("Wallet has been switched.");
      disConnectWallet();
    };

    if (connectedWallet.key === NEO_LINE) {
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
    if (connectedWallet.key === O3) {
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
  }, []);
  return (
    <div>
      <button
        onClick={toggleWalletSidebar}
        className="button is-small is-black is-rounded"
        aria-controls="dropdown-wallet"
      >
        <span>{utils.truncateAddress(connectedWallet.account.address)}</span>
      </button>
    </div>
  );
};

export default WalletDropdown;

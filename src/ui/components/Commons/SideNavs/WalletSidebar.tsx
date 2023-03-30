import React from "react";
import SideNav from "react-simple-sidenav";
import { useApp } from "../../../../common/hooks/use-app";
import Wallet from "../Wallets";

const WalletSidebar = () => {
  const { walletSidebarStatus, toggleWalletSidebar } = useApp();
  return (
    <SideNav
      openFromRight={true}
      style={{ top: "52px" }}
      showNav={walletSidebarStatus}
      onHideNav={toggleWalletSidebar}
      children={<Wallet />}
    />
  );
};

export default WalletSidebar;

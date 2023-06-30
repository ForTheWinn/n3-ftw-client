import React from "react";
import { useApp } from "../../../../common/hooks/use-app";
import Wallet from "../Wallets";
import { Drawer } from "antd";

const WalletSidebar = () => {
  const { walletSidebarStatus, toggleWalletSidebar } = useApp();
  return (
    <>
      <Drawer
        headerStyle={{ display: "none" }}
        rootStyle={{ top: "53px" }}
        bodyStyle={{ padding: "0" }}
        title="Basic Drawer"
        placement={"right"}
        closable={false}
        onClose={toggleWalletSidebar}
        open={walletSidebarStatus}
      >
        <Wallet isActive={walletSidebarStatus} />
      </Drawer>
    </>
  );
};

export default WalletSidebar;

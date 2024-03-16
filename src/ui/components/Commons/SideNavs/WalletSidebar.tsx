import React from "react";
import { useApp } from "../../../../common/hooks/use-app";
import Wallet from "../Wallets";
import { Drawer } from "antd";

const WalletSidebar = () => {
  const { walletSidebarStatus, toggleWalletSidebar } = useApp();
  return (
    <>
      <Drawer
        rootStyle={{ top: "53px" }}
        title="Basic Drawer"
        placement={"right"}
        closable={false}
        onClose={toggleWalletSidebar}
        open={walletSidebarStatus}
        styles={{
          header: { display: "none" },
          body: { padding: "0" },
        }}
      >
        <Wallet isActive={walletSidebarStatus} />
      </Drawer>
    </>
  );
};

export default WalletSidebar;

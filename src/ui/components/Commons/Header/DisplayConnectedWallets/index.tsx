import React from "react";
import { Avatar, Button } from "antd";
import NeoWalletConnected from "./NeoWalletConnected";
import EVMWalletConnected from "./EVMWalletConnected";
import { useApp } from "../../../../../common/hooks/use-app";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { useAccount } from "wagmi";

const btnStyle = { background: "#f4f4f4" };

const DisplayConnectedWallets = () => {
  const { toggleWalletSidebar } = useApp();
  const { connectedWallet } = useNeoWallets();
  const { isConnected } = useAccount();
  let isWalletConnected = connectedWallet || isConnected;
  return (
    <Button
      onClick={toggleWalletSidebar}
    >
      {isWalletConnected ? (
        <Avatar.Group size="small">
          <NeoWalletConnected
            connectedWallet={connectedWallet}
            style={btnStyle}
          />
          <EVMWalletConnected isConnected={isConnected} style={btnStyle} />
        </Avatar.Group>
      ) : (
        "Connect"
      )}
    </Button>
  );
};

export default DisplayConnectedWallets;

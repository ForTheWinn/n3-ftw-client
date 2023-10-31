import React from "react";
import { Avatar } from "antd";
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
    <button
      className="button is-rounded is-small is-dark is-inversed is-outlined"
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
    </button>
  );
};

export default DisplayConnectedWallets;

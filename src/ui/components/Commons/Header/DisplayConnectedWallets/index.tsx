import React from "react";
import { Avatar } from "antd";
import NeoWalletConnected from "./NeoWalletConnected";
import PolygonWalletConnected from "./PolygonWalletConnected";
import { useApp } from "../../../../../common/hooks/use-app";
import { useWallet } from "../../../../../packages/provider";
import { useAccount } from "wagmi";

const btnStyle = { background: "#f4f4f4" };

const DisplayConnectedWallets = () => {
  const { toggleWalletSidebar } = useApp();
  const { connectedWallet } = useWallet();
  const { isConnected} = useAccount();
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
          <PolygonWalletConnected isConnected={isConnected} style={btnStyle} />
        </Avatar.Group>
      ) : (
        "Connect"
      )}
    </button>
  );
};

export default DisplayConnectedWallets;

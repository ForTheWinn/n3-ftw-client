import React from "react";
import { useWallet } from "../../packages/neo/provider";

const NetworkCheck = () => {
  const { connectedWallet, network } = useWallet();
  if (!connectedWallet) return <></>;
  if (network === connectedWallet.network.defaultNetwork) return <></>;
  return (
    <div
      className="notification is-danger"
      style={{ position: "absolute", maxWidth: "300px" }}
    >
      Your connected wallet has different network
    </div>
  );
};

export default NetworkCheck;

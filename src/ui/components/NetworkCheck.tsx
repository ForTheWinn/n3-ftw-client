import React from "react";
import { useNeoWallets } from "../../common/hooks/use-neo-wallets";
import { useApp } from "../../common/hooks/use-app";

const NetworkCheck = () => {
  const { connectedWallet } = useNeoWallets();
  const { network } = useApp();
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

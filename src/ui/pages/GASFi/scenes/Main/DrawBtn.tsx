import React from "react";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { toast } from "react-hot-toast";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { useApp } from "../../../../../common/hooks/use-app";

const DrawBtn = () => {
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();

  const onDraw = async () => {
    if (connectedWallet) {
      try {
        const tx = await new GasFiContract(network).draw(connectedWallet);
        setTxid(tx);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
    }
  };
  return (
    <div>
      <button onClick={onDraw} className="button">
        Draw
      </button>
    </div>
  );
};

export default DrawBtn;

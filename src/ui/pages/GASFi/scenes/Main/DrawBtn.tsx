import React, { useState } from "react";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { toast } from "react-hot-toast";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import { useApp } from "../../../../../common/hooks/use-app";

const DrawBtn = () => {
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [txid, setTxid] = useState("");

  const onDraw = async () => {
    if (connectedWallet) {
      try {
        const tx = await new GasFiContract(network).draw(connectedWallet);
        setTxid(tx);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      // toggleWalletSidebar();
    }
  };
  return (
    <div>
      <button onClick={onDraw} className="button">
        Draw
      </button>

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={() => setTxid("")}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default DrawBtn;

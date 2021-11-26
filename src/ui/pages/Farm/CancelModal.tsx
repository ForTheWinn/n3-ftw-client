import React, { useState } from "react";
import Modal from "../../components/Modal";
import { FarmContract } from "../../../packages/neo/contracts";
import { useWallet } from "../../../packages/provider";
import { toast } from "react-hot-toast";
import TransactionSubmitted from "../../components/TransactionSubmitted";

interface IActionModal {
  onClose: () => void;
}
const CancelModal = ({ onClose }: IActionModal) => {
  const { network, connectedWallet, openWalletModal } = useWallet();
  const [txid, setTxid] = useState<string>();
  const onCancel = async () => {
    if (connectedWallet) {
      try {
        const txid = await new FarmContract(network).remove(connectedWallet);
        setTxid(txid);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message);
      }
    } else {
      openWalletModal();
    }
  };
  return (
    <Modal onClose={onClose}>
      {txid ? (
        <TransactionSubmitted txid={txid} onClick={onClose} />
      ) : (
        <>
          <h1 className="title is-flex">Confirm close</h1>
          <button onClick={onCancel} className="button is-button is-black">
            Close my position
          </button>
        </>
      )}
    </Modal>
  );
};

export default CancelModal;

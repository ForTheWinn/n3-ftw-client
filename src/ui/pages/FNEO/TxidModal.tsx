import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import TxReceipt from "../../components/Commons/TxHandler/TxReceipt";
import { waitForTransaction } from "@wagmi/core";
import { getExplorerByChainId } from "../../../common/helpers";

interface ITxidModalProps {
  txid: string;
  chainId: number;
  resetTxid: () => void;
}
const TxidModal = ({ txid, chainId, resetTxid }: ITxidModalProps) => {
  const [isDone, setDone] = useState(false);
  const [hasError, setError] = useState("");

  useEffect(() => {
    async function checkTxid(_txid: string) {
      try {
        await waitForTransaction({
          hash: txid as `0x${string}`,
          chainId,
        });
        setDone(true);
      } catch (e: any) {
        setError(e.message);
      }
    }
    if (txid) {
      checkTxid(txid);
    }
  }, []);

  if (!txid) return <></>;
  return (
    <div>
      <Modal onClose={resetTxid}>
        <TxReceipt
          txid={txid}
          isSuccess={isDone}
          error={hasError}
          onSuccess={resetTxid}
          onError={resetTxid}
          explorer={getExplorerByChainId(chainId, "tx")}
        />
      </Modal>
    </div>
  );
};

export default TxidModal;

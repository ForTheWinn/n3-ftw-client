import React, { useEffect, useState } from "react";
import TxReceipt from "./TxReceipt";
import { useApp } from "../../../../common/hooks/use-app";
import Modal from "../../Modal";
import { waitTransactionUntilSubmmited } from "../../../../common/routers/global";
import { getExplorer } from "../../../../common/helpers";

const TxHandler = () => {
  const { chain, network, txid, resetTxid } = useApp();
  const [isDone, setDone] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    async function checkTxid(_txid: string) {
      try {
        const res = await waitTransactionUntilSubmmited(chain, network, _txid);
        if (res) {
          setDone(true);
        }
      } catch (e: any) {
        setError(e.message);
      }
    }
    if (txid) {
      checkTxid(txid);
    }

    return () => {
      if (!txid) {
        setDone(false);
        setError(undefined);
      }
    };
  }, [txid]);

  if (!txid) return <></>;
  return (
    <Modal onClose={resetTxid}>
      <TxReceipt
        txid={txid}
        isSuccess={isDone}
        error={error}
        onSuccess={resetTxid}
        onError={resetTxid}
        explorer={getExplorer(chain, network, "tx")}
      />
    </Modal>
  );
};

export default TxHandler;

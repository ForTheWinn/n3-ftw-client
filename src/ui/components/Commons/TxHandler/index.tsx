import React, { useEffect, useState } from "react";
import { INetworkType, Network } from "../../../../packages/neo/network";
import { TESTNET } from "../../../../packages/neo/consts";
import TxReceipt from "./TxReceipt";

interface IAfterTransactionSubmittedProps {
  txid: string;
  network: INetworkType;
  onSuccess: () => void;
  onError: () => void;
}
const TxHandler = ({
  txid,
  network,
  onSuccess,
  onError
}: IAfterTransactionSubmittedProps) => {
  const [isDone, setDone] = useState(false);
  const [hasError, setError] = useState("");

  useEffect(() => {
    async function checkTxid() {
      try {
        const res = await Network.getRawTx(txid, network);
        if (res) {
          setDone(true);
        }
      } catch (e: any) {
        setError(e.message);
      }
    }
    checkTxid();
  }, [txid]);

  return (
    <TxReceipt
      txid={txid}
      isSuccess={isDone}
      error={hasError}
      onSuccess={onSuccess}
      onError={onError}
      explorer={`https://${
        network === TESTNET ? "testmagnet." : ""
      }explorer.onegate.space/transactionInfo/`}
    />
  );
};

export default TxHandler;

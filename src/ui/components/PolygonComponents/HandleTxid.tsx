import React from "react";
import { useWaitForTransaction } from "wagmi";
import TxReceipt from "../Commons/TxHandler/TxReceipt";

interface IAfterTransactionSubmittedProps {
  explorer?: string;
  txid: `0x${string}`;
  onSuccess: () => void;
  onError: () => void;
}
const HandleTxid = ({
  explorer,
  txid,
  onSuccess,
  onError
}: IAfterTransactionSubmittedProps) => {
  const { isLoading, isSuccess, error } = useWaitForTransaction({
    hash: txid
  });
  console.log(error);

  return (
    <TxReceipt
      txid={txid}
      isSuccess={isSuccess}
      error={error?.message}
      onSuccess={onSuccess}
      onError={onError}
      explorer={explorer || ""}
    />
  );
};

export default HandleTxid;

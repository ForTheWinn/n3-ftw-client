import React from "react";
import CubeLoading from "../../../CubeLoading";
import { Button, Result } from "antd";
import { WENT_WRONG } from "../../../../../consts/messages";

interface ITxReceiptProps {
  error?: string;
  txid: string;
  explorer: string;
  isSuccess: boolean;
  onError: () => void;
  onSuccess: () => void;
}

const TxReceipt = ({
  isSuccess,
  error,
  txid,
  onError,
  onSuccess,
  explorer
}: ITxReceiptProps) => {
  if (!isSuccess && !error) return <CubeLoading />;
  if (error) {
    return (
      <Result
        status={"error"}
        title={error ? error : WENT_WRONG}
        extra={[
          <Button onClick={onError} key="close">
            Close
          </Button>
        ]}
      ></Result>
    );
  }
  return (
    <Result
      status={"success"}
      title={"CONFIRMED"}
      subTitle={"Your transaction has been successfully accepted."}
      extra={[
        <Button
          target="_blank"
          href={`${explorer}/${txid}`}
          type="primary"
          key="console"
        >
          Detilas
        </Button>,
        <Button onClick={onSuccess} key="close">
          Close
        </Button>
      ]}
    ></Result>
  );
};

export default TxReceipt;

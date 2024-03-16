import React from "react";
import { Button, Result } from "antd";
import { CHAINS } from "../../consts/chains";
import { INetworkType } from "../../packages/neo/network";
import { getExplorer } from "../../common/helpers";

interface ITxResultProps {
  chain: CHAINS;
  network: INetworkType;
  txid: any;
  error?: string;
  onClose: () => void;
}
export const TxResult = ({ chain, network, txid, onClose }: ITxResultProps) => {
  return (
    <Result
      status={"success"}
      subTitle="Successfully submitted transaction!"
      extra={[
        <Button
          target="_blank"
          href={`${getExplorer(chain, network, "tx")}/${txid}`}
          type="primary"
        >
          View Tx
        </Button>,
        <Button onClick={onClose}>Close</Button>,
      ]}
    />
  );
};

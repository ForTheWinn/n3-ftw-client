import React, { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";
import { useApp } from "../../../../../common/hooks/use-app";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { Network } from "../../../../../packages/neo/network";
import { getSpinEvent } from "../../../../../packages/neo/contracts/ftw/smith/helpers";
import { Button, Space, Spin as AntSpin } from "antd";
import { DisplayAd } from "../../../Swap/components/Actions/components/DisplayAd";
import { getExplorer } from "../../../../../common/helpers";
import { NEO_CHAIN } from "../../../../../consts/global";

interface ISpinProps {
  txid: string;
  onClose: () => void;
}
const Spin = ({ txid, onClose }: ISpinProps) => {
  const { chain, network } = useApp();
  const { client, address } = useWalletRouter(chain);
  const [result, setResult] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (txid) {
        try {
          const res = await Network.getRawTx(txid, network);
          const rn = getSpinEvent(res);
          setResult(rn);
        } catch (e: any) {
          setError(e.message);
        }
      }
    })();
  }, [client, network, txid]);

  return (
    <div className="has-text-centered">
      {/* <img src="/assets/matrix.gif" width={"120px"} /> */}
      <h6 className="title is-5">Wake up NEO..</h6>
      <p className="subtitle is-6">
        {result
          ? "We got the answer from Neo. Your number is.."
          : "Waiting the result from the matrix.."}
      </p>
      {result ? (
        <>
          <SlotCounter value={result} hasInfiniteList={true} />
          <br />
          <br />
          <Space>
            <Button
              target="_blank"
              href={`${getExplorer(NEO_CHAIN, network, "tx")}/${txid}`}
              // type="primary"
            >
              Details
            </Button>
            <Button onClick={onClose} key="close">
              Go back
            </Button>
          </Space>
        </>
      ) : (
        <AntSpin />
      )}
    </div>
  );
};

export default Spin;

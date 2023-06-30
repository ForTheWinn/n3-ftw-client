import React, { useEffect, useState } from "react";
import {
  INetworkType,
  Network,
} from "../../../../../../../packages/neo/network";
import { Button, Result } from "antd";
import CubeLoading from "../../../../../../components/CubeLoading";
import { getTokenContractHashNotifications } from "../../../../../../../packages/neo/contracts/ftw/smith/helpers";
import { WENT_WRONG } from "../../../../../../../consts/messages";
import { NEO_CHAIN } from "../../../../../../../consts/global";
import { getExplorer } from "../../../../../../../common/helpers";

interface IAfterTransactionSubmittedProps {
  txid: string;
  network: INetworkType;
  onSuccess: () => void;
  onError: () => void;
}
const NEOSmithActionModal = ({
  txid,
  network,
  onSuccess,
  onError,
}: IAfterTransactionSubmittedProps) => {
  const [isLoading, setLoading] = useState(true);
  const [contractHash, setContractHash] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    async function checkTxid() {
      setLoading(true);
      try {
        const res = await Network.getRawTx(txid, network);
        const contractHash = getTokenContractHashNotifications(res);
        setContractHash(contractHash);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
      }
      setLoading(false);
    }
    checkTxid();
  }, [txid]);

  if (isLoading) {
    return <CubeLoading />;
  }
  if (error) {
    <Result
      status={"error"}
      title={error ? error : WENT_WRONG}
      extra={[
        <Button onClick={onError} key="close">
          Close
        </Button>,
      ]}
    ></Result>;
  }
  return (
    <div>
      <Result
        status={"success"}
        title={"Successfully deployed your token contract!"}
        subTitle={`contract hash: ${contractHash}`}
        extra={[
          <Button
            target="_blank"
            href={`${getExplorer(
              NEO_CHAIN,
              network,
              "contract"
            )}/${contractHash}`}
            type="primary"
            key="console"
          >
            Detilas
          </Button>,
          <Button onClick={onSuccess} key="close">
            Close
          </Button>,
        ]}
      ></Result>
    </div>
  );
};

export default NEOSmithActionModal;

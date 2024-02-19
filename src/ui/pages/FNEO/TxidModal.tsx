import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import TxReceipt from "../../components/Commons/TxHandler/TxReceipt";
import { waitForTransactionReceipt } from "@wagmi/core";
import { getExplorerByChainId } from "../../../common/helpers";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { INetworkType } from "../../../packages/neo/network";
import { wagmiConfig } from "../../../wagmi-config";

interface ITxidModalProps {
  txid: string;
  chain: CHAINS;
  network: INetworkType;
  resetTxid: () => void;
}
const TxidModal = ({ txid, network, chain, resetTxid }: ITxidModalProps) => {
  const [isDone, setDone] = useState(false);
  const [hasError, setError] = useState("");
  const chainId = CONFIGS[network][chain].chainId;
  useEffect(() => {
    async function checkTxid(_txid: string) {
      try {
        await waitForTransactionReceipt(wagmiConfig, {
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

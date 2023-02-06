import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { FARM_V2_PATH } from "../../../../../consts";
import { useWallet } from "../../../../../packages/provider";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import PositionList from "./PositionList";
import { handleError } from "../../../../../packages/neo/utils/errors";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";

const MyPositions = ({ onRefresh }) => {
  const { network, connectedWallet } = useWallet();
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  const onUnStake = async (tokenId) => {
    if (connectedWallet) {
      try {
        const res = await new FarmV2Contract(network).remove(
          connectedWallet,
          tokenId
        );
        setTxid(res);
      } catch (e: any) {
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const onSuccess = () => {
    onRefresh();
    setRefresh(refresh + 1);
    setTxid("");
  };

  return (
    <div>
      <HeaderBetween path={FARM_V2_PATH} title={`My staking`} />
      <hr />
      {connectedWallet ? (
        <PositionList
          network={network}
          connectedWallet={connectedWallet}
          refresh={refresh}
          onUnStake={onUnStake}
        />
      ) : (
        <ConnectWalletButton />
      )}

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default MyPositions;

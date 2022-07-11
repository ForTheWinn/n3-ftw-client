import React, { useState } from "react";
import { FARM_V2_PATH} from "../../../../../consts";
import HeaderBetween from "../../../../components/HeaderBetween";
import { useWallet } from "../../../../../packages/provider";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenList from "./LPTokenList";
import { handleError } from "../../../../../packages/neo/utils/errors";
import {FarmV2Contract} from "../../../../../packages/neo/contracts/ftw/farm-v2";

const Stake = ({ onRefresh }) => {
  const { network, connectedWallet } = useWallet();
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  const onStakeLP = async (tokenId) => {
    if (connectedWallet) {
      try {
        const res = await new FarmV2Contract(network).stake(
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
      <HeaderBetween path={FARM_V2_PATH} title={`Stake LP tokens`} />
      <hr />
      {connectedWallet ? (
        <LPTokenList
          refresh={refresh}
          connectedWallet={connectedWallet}
          network={network}
          onStakeLP={onStakeLP}
          onRefresh={() => setRefresh(refresh + 1)}
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

export default Stake;

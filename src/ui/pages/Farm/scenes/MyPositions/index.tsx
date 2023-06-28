import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import { toast } from "react-hot-toast";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import PositionList from "./PositionList";
import { handleError } from "../../../../../packages/neo/utils/errors";
import { useApp } from "../../../../../common/hooks/use-app";
import { FARM_PATH } from "../../../../../consts/routes";

const MyPositions = ({ onRefresh }) => {
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [refresh, setRefresh] = useState(0);

  const onUnStake = async (tokenId) => {
    if (connectedWallet) {
      try {
        const res = await new StakingContract(network).remove(
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
      <HeaderBetween path={FARM_PATH} title={`My staking`} />
      <hr />
      {connectedWallet ? (
        <PositionList
          network={network}
          connectedWallet={connectedWallet}
          refresh={refresh}
          // onRefresh={() => setRefresh(refresh + 1)}
          onUnStake={onUnStake}
        />
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
};

export default MyPositions;

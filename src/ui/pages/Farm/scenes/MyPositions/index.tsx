import React from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import PositionList from "./PositionList";
import { useApp } from "../../../../../common/hooks/use-app";
import { FARM_PATH } from "../../../../../consts/routes";
import { WENT_WRONG } from "../../../../../consts/messages";
import { message } from "antd";

const MyPositions = () => {
  const { network, setTxid, refreshCount } = useApp();
  const { connectedWallet } = useNeoWallets();

  const onUnStake = async (tokenId) => {
    if (connectedWallet) {
      try {
        const res = await new StakingContract(network).remove(
          connectedWallet,
          tokenId
        );
        setTxid(res);
      } catch (e: any) {
        message.error(e.message ? e.message : WENT_WRONG);
      }
    } else {
      message.error("Please connect wallet");
    }
  };


  return (
    <div>
      <HeaderBetween path={FARM_PATH} title={`My staking`} />
      <hr />
      {connectedWallet ? (
        <PositionList
          network={network}
          connectedWallet={connectedWallet}
          refresh={refreshCount}
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

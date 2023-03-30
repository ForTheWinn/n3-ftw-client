import React from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useWallet } from "../../../../../packages/neo/provider";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import PositionList from "./PositionList";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { CHAINS } from "../../../../../consts/chains";
import { farmRouter } from "../../../../../common/routers";
import { useApp } from "../../../../../common/hooks/use-app";

interface IMyPositionsProps {
  path: string;
  chain: CHAINS;
}
const MyPositions = ({ path, chain }: IMyPositionsProps) => {
  const { setTxid } = useApp();
  const { network, connectedWallet } = useWallet();
  const { isConnected, address } = useWalletRouter(chain);

  const onUnStake = async (tokenId: string) => {
    const txid = await farmRouter.unStakeLPToken(
      chain,
      network,
      tokenId,
      connectedWallet
    );
    setTxid(txid);
  };

  return (
    <div>
      <HeaderBetween path={path} title={`My staking`} />
      <hr />
      {isConnected ? (
        <PositionList
          chain={chain}
          network={network}
          address={address}
          onUnStake={onUnStake}
        />
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
};

export default MyPositions;

import React from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import PositionList from "./PositionList";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { farmRouter } from "../../../../../common/routers";
import { useApp } from "../../../../../common/hooks/use-app";
import { NEO_ROUTES } from "../../../../../consts";

const MyPositions = () => {
  const { setTxid, network, chain } = useApp();
  const { connectedWallet } = useNeoWallets();
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
      <HeaderBetween path={NEO_ROUTES.FARM_V2_PATH} title={`My staking`} />
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

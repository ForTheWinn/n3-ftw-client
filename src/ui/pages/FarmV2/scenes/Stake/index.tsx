import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenList from "./LPTokenList";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { farmRouter } from "../../../../../common/routers";
import { useApp } from "../../../../../common/hooks/use-app";
import { NEO_ROUTES } from "../../../../../consts";


const Stake = () => {
  const { setTxid, chain, network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const { isConnected, address } = useWalletRouter(chain);
  const [refresh, setRefresh] = useState(0);

  const onStake = async (tokenId: string) => {
    const txid = await farmRouter.stakeLPToken(
      chain,
      network,
      tokenId,
      address,
      connectedWallet
    );
    setTxid(txid);
  };

  return (
    <div>
      <HeaderBetween path={NEO_ROUTES.FARM_V2_PATH} title={`Stake LP tokens`} />
      <hr />
      {isConnected ? (
        <LPTokenList
          chain={chain}
          refresh={refresh}
          address={address}
          network={network}
          onStake={onStake}
          onRefresh={() => setRefresh(refresh + 1)}
        />
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
};

export default Stake;

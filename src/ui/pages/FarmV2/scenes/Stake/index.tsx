import React, { useState } from "react";
import { FARM_V2_PATH } from "../../../../../consts";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useWallet } from "../../../../../packages/neo/provider";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenList from "./LPTokenList";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { farmRouter } from "../../../../../common/routers";
import { useApp } from "../../../../../common/hooks/use-app";

interface IStakeProps {
  chain: CHAINS;
  network: INetworkType;
  path: string;
}
const Stake = ({ chain, network, path }: IStakeProps) => {
  const { setTxid } = useApp();
  const { connectedWallet } = useWallet();
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
      <HeaderBetween path={`${path}`} title={`Stake LP tokens`} />
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

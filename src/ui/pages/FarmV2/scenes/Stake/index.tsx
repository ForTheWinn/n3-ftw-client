import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenList from "./LPTokenList";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { farmRouter } from "../../../../../common/routers";
import { useApp } from "../../../../../common/hooks/use-app";
import { FARM_V2_PATH } from "../../../../../consts/routes";
import { message } from "antd";
import { WENT_WRONG } from "../../../../../consts/messages";

const Stake = () => {
  const { setTxid, chain, network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const { isConnected, address } = useWalletRouter(chain);
  const [refresh, setRefresh] = useState(0);

  const onStake = async (tokenId: string) => {
    try {
      const txid = await farmRouter.stakeLPToken(
        chain,
        network,
        tokenId,
        address,
        connectedWallet
      );
      setTxid(txid as string);
    } catch (e: any) {
      console.error(e);
      message.error(e.message ? e.message : WENT_WRONG);
    }
  };

  return (
    <div>
      <HeaderBetween path={FARM_V2_PATH} title={`Stake LP tokens`} />
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

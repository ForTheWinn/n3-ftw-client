import React from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import { useApp } from "../../../../../common/hooks/use-app";

const MarketStatus = () => {
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const { isLoaded, data } = useOnChainData(() => {
    return new StakingContract(network).getMarketStatus();
  }, [connectedWallet, network]);
  if (!isLoaded) return <></>;
  if (isLoaded && data) return <></>;
  return (
    <div className="notification has-text-centered title is-5  is-info is-light">
      In maintenance
    </div>
  );
};

export default MarketStatus;

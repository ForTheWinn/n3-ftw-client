import React from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { useApp } from "../../../../../common/hooks/use-app";

const MarketStatus = () => {
  const { connectedWallet } = useNeoWallets();
  const { network } = useApp();
  const { isLoaded, data } = useOnChainData(() => {
    return new FarmV2Contract(network).getMarketStatus();
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

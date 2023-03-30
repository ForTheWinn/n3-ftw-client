import React from "react";
import { useWallet } from "../../../../../packages/neo/provider";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { SwapContract } from "../../../../../packages/neo/contracts";

const MarketStatus = () => {
  const { network, connectedWallet } = useWallet();
  const { isLoaded, data } = useOnChainData(() => {
    return new SwapContract(network).getMarketStatus();
  }, [connectedWallet, network]);
  if (!isLoaded) return <></>;
  if (isLoaded && data) return <></>;
  return (
    <div className="notification has-text-centered title is-5 is-info is-light">
      In maintenance
    </div>
  );
};

export default MarketStatus;

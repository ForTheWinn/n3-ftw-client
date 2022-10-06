import React from "react";
import LPTokenCard from "./LPTokenCard";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { IConnectedWallet } from "../../../../../packages/neo/wallet/interfaces";
import { INetworkType } from "../../../../../packages/neo/network";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import { SwapContract } from "../../../../../packages/neo/contracts";
import queryString from "query-string";
import { useLocation } from "react-router-dom";

interface ILPTokenListProps {
  connectedWallet: IConnectedWallet;
  network: INetworkType;
  // symbolA: string;
  // symbolB: string;
  onStakeLP: (tokenId: string) => void;
  refresh: number;
  onRefresh: () => void;
}
const LPTokenList = ({
  network,
  // symbolA,
  // symbolB,
  connectedWallet,
  onStakeLP,
  refresh,
  onRefresh,
}: ILPTokenListProps) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SwapContract(network).getLPTokens(
      connectedWallet
      // symbolA,
      // symbolB
    );
  }, [connectedWallet, network, refresh]);
  let matchedTokens = [];
  if (isLoaded) {
    matchedTokens = data.filter((item) => {
      return params.tokenA === item.tokenA && params.tokenB === item.tokenB;
    });
  }
  return (
    <div>
      {!isLoaded ? (
        <div>Loading your LP tokens</div>
      ) : error ? (
        <ErrorNotificationWithRefresh error={error} onRefresh={onRefresh} />
      ) : (
        <div>
          {matchedTokens.length > 0 ? (
            matchedTokens.map((item, i) => {
	            return (
                <LPTokenCard
                  network={network}
                  onStakeLP={onStakeLP}
	                // @ts-ignore
                  {...item}
	                // @ts-ignore
                  key={`${item.name}-${i}`}
                />
              );
            })
          ) : (
            <div>You don't have LP tokens in your wallet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LPTokenList;

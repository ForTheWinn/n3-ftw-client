import React from "react";
import LPTokenCard from "./LPTokenCard";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { INetworkType } from "../../../../../packages/neo/network";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { CHAINS } from "../../../../../packages/chains/consts";
import { IFarmLPToken } from "../../../../../common/routers/farm/interfaces";
import { farmRouter } from "../../../../../common/routers";

interface ILPTokenListProps {
  chain: CHAINS;
  address: string;
  network: INetworkType;
  refresh: number;
  onStake: (tokenId: string) => void;
  onRefresh: () => void;
}
const LPTokenList = ({
  chain,
  network,
  address,
  refresh,
  onStake,
  onRefresh
}: ILPTokenListProps) => {
  const location = useLocation();

  const params = queryString.parse(location.search);

  const { isLoaded, error, data } = useOnChainData(
    () => farmRouter.getLPTokens(chain, network, address),
    [address, network, refresh]
  );

  const matchedTokens: IFarmLPToken[] = [];

  if (data) {
    data.forEach((item: IFarmLPToken) => {
      console.log(item);
      if (params.tokenA === item.tokenA && params.tokenB === item.tokenB) {
      }
      matchedTokens.push(item);
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
            matchedTokens.map((item: IFarmLPToken, i) => {
              return (
                <LPTokenCard
                  key={`${item.name}-${i}`}
                  LPToken={item}
                  onStake={onStake}
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

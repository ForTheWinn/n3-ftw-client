import React from "react";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { INetworkType } from "../../../../../packages/neo/network";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { CHAINS } from "../../../../../consts/chains";
import { swapRouter } from "../../../../../common/routers";
import { ISwapLPToken } from "../../../../../common/routers/swap/interfaces";
import LPTokenCard from "../../../../components/LPTokenCard";

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
    () => swapRouter.getLPTokens(chain, network, address),
    [address, network, refresh]
  );

  const matchedTokens: ISwapLPToken[] = [];

  if (data && params.tokenA && params.tokenB) {
    const tokenA = (params.tokenA as string).toLocaleLowerCase();
    const tokenB = (params.tokenB as string).toLocaleLowerCase();
    data.forEach((item: ISwapLPToken) => {
      if (
        (tokenA === item.tokenA && tokenB === item.tokenB) ||
        (tokenA === item.tokenB && tokenB === item.tokenA)
      ) {
        matchedTokens.push(item);
      }
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
            matchedTokens.map((token: ISwapLPToken, i) => {
              return (
                <>
                  <div className="media">
                    <div className="media-content">
                      <LPTokenCard {...token} />
                    </div>
                    <div className="media-right">
                      <button
                        onClick={() => onStake(token.tokenId)}
                        className="button is-small is-primary"
                      >
                        Stake
                      </button>
                    </div>
                  </div>
                </>
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

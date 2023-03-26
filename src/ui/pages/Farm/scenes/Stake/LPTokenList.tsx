import React from "react";
import LPTokenCard from "./LPTokenCard";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { IConnectedWallet } from "../../../../../packages/neo/wallet/interfaces";
import { INetworkType } from "../../../../../packages/neo/network";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import {SwapContract} from "../../../../../packages/neo/contracts";

interface ILPTokenListProps {
  connectedWallet: IConnectedWallet;
  network: INetworkType;
  symbolA: string;
  symbolB: string;
  onStakeLP: (tokenId: string) => void;
  refresh: number;
  onRefresh: () => void;
}
const LPTokenList = ({
  network,
  symbolA,
  symbolB,
  connectedWallet,
  onStakeLP,
  refresh,
  onRefresh,
}: ILPTokenListProps) => {
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SwapContract(network).getLPTokens(
      connectedWallet.account.address,
      // symbolA,
      // symbolB
    );
  }, [connectedWallet, network, refresh]);
  return (
    <div>
      {!isLoaded ? (
        <div>Loading your LP tokens</div>
      ) : error ? (
        <ErrorNotificationWithRefresh error={error} onRefresh={onRefresh} />
      ) : (
        <div>
          {data && data.length > 0 ? (
            data.map((item, i) => {
              return (
                <LPTokenCard
                  network={network}
                  onStakeLP={onStakeLP}
                  {...item}
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

import React from "react";
import { SwapContract } from "../../../../../../../packages/neo/contracts";
import LPTokenItem from "./LPTokenItem";
import { useOnChainData } from "../../../../../../../common/hooks/use-onchain-data";
import { IConnectedWallet } from "../../../../../../../packages/neo/wallets/interfaces";
import { INetworkType } from "../../../../../../../packages/neo/network";

interface ILPTokenListProps {
  connectedWallet: IConnectedWallet;
  network: INetworkType;
  refresh: number;
  onRemoveLiquidity: (tokenId: string) => void;
}
const LPTokenList = ({
  network,
  connectedWallet,
  refresh,
  onRemoveLiquidity
}: ILPTokenListProps) => {
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SwapContract(network).getLPTokens(
      connectedWallet.account.address
    );
  }, [connectedWallet, network, refresh]);

  return (
    <>
      {!isLoaded ? (
        <div>Loading..</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          {data && data.length > 0 ? (
            data.map((item, i) => {
              return (
                <LPTokenItem
                  {...item}
                  network={network}
                  onRemove={onRemoveLiquidity}
                  key={`${item.name}-${i}`}
                />
              );
            })
          ) : (
            <div>You don't have LP tokens in your wallet</div>
          )}
        </div>
      )}
    </>
  );
};

export default LPTokenList;

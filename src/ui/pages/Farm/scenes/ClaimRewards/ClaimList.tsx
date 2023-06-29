import React from "react";
import CounterUp from "./CounterUp";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import { INetworkType } from "../../../../../packages/neo/network";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
interface IClaimListProps {
  network: INetworkType;
  connectedWallet?: IConnectedWallet;
  refresh: number;
  isClaimNode: boolean;
  handleToggle: (item: any) => void;
  selectedItems: any[];
}
const ClaimList = ({
  network,
  connectedWallet,
  refresh,
  isClaimNode,
  handleToggle,
  selectedItems
}: IClaimListProps) => {
  const { isLoaded, data } = useOnChainData(() => {
    return new StakingContract(network).getClaimable(connectedWallet);
  }, [connectedWallet, network, refresh]);
  if (!isLoaded) <div></div>;
  return (
    <div>
      {isLoaded &&
        data.map((item, i) => {
          let isSelected = false;
          selectedItems.forEach((_item) => {
            if (item.tokenA === _item.tokenA && item.tokenB === _item.tokenB) {
              isSelected = true;
            }
          });
          return (
            <div key={`claim-${i}`} className="media">
              {isClaimNode && (
                <div className="media-left">
                  <input
                    onClick={() => handleToggle(item)}
                    type="checkbox"
                    checked={isSelected}
                  />
                </div>
              )}
              <div className="media-content content is-small">
                <div className="level is-mobile">
                  <div className="level-left">
                    <div className="level-item">
                      <span className="has-text-weight-medium">
                        {item.tokenASymbol}-{item.tokenBSymbol}
                      </span>
                    </div>
                  </div>

                  <div className="level-right">
                    <div className="level-item">
                      <CounterUp
                        claimable={item.claimable}
                        rewardsPerDay={item.rewardsPerDay}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ClaimList;

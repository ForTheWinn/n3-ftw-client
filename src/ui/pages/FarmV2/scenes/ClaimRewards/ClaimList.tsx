import React, { useState } from "react";
import CounterUp from "./CounterUp";
import { INetworkType } from "../../../../../packages/neo/network";
import { DISPLAY_OPTIONS, REALTIME } from "./consts";
import { IPrices } from "../../../../../packages/neo/api/interfaces";
import RewardsInRange from "./RewardsInRange";
import { NEP_SCRIPT_HASH } from "../../../../../packages/neo/consts/nep17-list";
import { IClaimableRewards } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";
interface IClaimListProps {
  bonus: number;
  network: INetworkType;
  isClaimNode: boolean;
  handleToggle: (item: any) => void;
  selectedItems: any[];
  prices?: IPrices;
  rewards: IClaimableRewards[];
}
const ClaimList = ({
  bonus,
  network,
  isClaimNode,
  handleToggle,
  selectedItems,
  prices,
  rewards,
}: IClaimListProps) => {
  const [rewardDisplayType, setRewardDisplayType] = useState<string>(REALTIME);
  return (
    <>
      {rewards.map((item, i) => {
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
                  <div className="level-item is-block has-text-right">
                    <small>
                      {rewardDisplayType === REALTIME ? (
                        <CounterUp
                          bonus={bonus}
                          symbol="NEP"
                          claimable={item.rewardsToHarvest}
                          rewardsPerSecond={item.nepTokensPerSecond}
                          tokensStaked={item.tokensStaked}
                          share={item.share}
                          pricePerToken={
                            prices ? prices["0x" + NEP_SCRIPT_HASH[network]] : 0
                          }
                        />
                      ) : (
                        <RewardsInRange
                          bonus={bonus}
                          timeRangeType={rewardDisplayType}
                          symbol="NEP"
                          claimable={item.rewardsToHarvest}
                          rewardsPerSecond={item.nepTokensPerSecond}
                          tokensStaked={item.tokensStaked}
                          share={item.share}
                          pricePerToken={
                            prices ? prices["0x" + NEP_SCRIPT_HASH[network]] : 0
                          }
                        />
                      )}
                    </small>

                    {item.bonusTokensPerSecond > 0 ? (
                      <div className="mt-2">
                        <small>
                          {rewardDisplayType === REALTIME ? (
                            <CounterUp
                              bonus={bonus}
                              symbol={item.bonusTokenSymbol}
                              claimable={item.bonusToHarvest}
                              rewardsPerSecond={item.bonusTokensPerSecond}
                              tokensStaked={item.tokensStaked}
                              share={item.share}
                              pricePerToken={
                                prices ? prices["0x" + item.bonusTokenHash] : 0
                              }
                            />
                          ) : (
                            <RewardsInRange
                              bonus={bonus}
                              timeRangeType={rewardDisplayType}
                              symbol={item.bonusTokenSymbol}
                              claimable={item.bonusToHarvest}
                              rewardsPerSecond={item.bonusTokensPerSecond}
                              tokensStaked={item.tokensStaked}
                              share={item.share}
                              pricePerToken={
                                prices ? prices["0x" + item.bonusTokenHash] : 0
                              }
                            />
                          )}
                        </small>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {rewards.length > 0 ? (
        <div className="media" style={{ alignItems: "center" }}>
          <div className="media-left is-hidden-mobile">
            <span className="has-text-weight-medium">Estimate</span>
          </div>
          <div className="media-content">
            <div className="field has-addons is-fullwidth">
              {DISPLAY_OPTIONS.map((op) => {
                return (
                  <p className="control">
                    <button
                      onClick={() => setRewardDisplayType(op.val)}
                      className={`button is-small ${
                        rewardDisplayType === op.val
                          ? "is-active is-success is-light"
                          : ""
                      }`}
                    >
                      <span>{op.label}</span>
                    </button>
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ClaimList;

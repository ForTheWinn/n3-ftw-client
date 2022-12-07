import React, { useState } from "react";
import DisplayBoy from "../MyBoyz/DisplayBoy";
import { INetworkType } from "../../../../../packages/neo/network";
import MyBoyz from "../MyBoyz";
import { IBoyStaked } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";

interface IStakingModalProps {
  lot: IBoyStaked;
  network: INetworkType;
  onStake: (tokenId: string, lotNo: string) => void;
  onUnStake: (tokenId: string, lotNo: string) => void;
}
const StakingModal = ({
  lot,
  network,
  onStake,
  onUnStake,
}: IStakingModalProps) => {
  const [isDisplayTokensActive, setDisplayTokensActive] = useState(false);
  return (
    <div className="">
      {lot ? (
        <div className="has-text-centered">
          <figure
            className="image is-128x128 mb-4"
            style={{ margin: "auto" }}
          >
            <DisplayBoy onClick={() => {}} network={network} id={lot.tokenId} />
          </figure>
          <div className="content">
            {lot.tokenId ? (
              <>
                <strong>{lot.tokenId}</strong>
                {lot.tier !== "0" ? (
                  <>
                    <br />
                    <span className="tag is-info">Tier {lot.tier}</span>
                  </>
                ) : (
                  <></>
                )}
                <br />
                <br />
                Staked at: {lot.createdAt}
              </>
            ) : (
              <></>
            )}
            <p></p>
          </div>
          <div className="buttons" style={{ justifyContent: "center" }}>
            <button
              onClick={() => setDisplayTokensActive(!isDisplayTokensActive)}
              className="button is-primary"
            >
              Stake
            </button>
            {lot.tokenId ? (
              <button
                onClick={() => onUnStake(lot.tokenId, lot.lotNo)}
                className="button is-danger"
              >
                UnStake
              </button>
            ) : (
              <></>
            )}
          </div>
          {isDisplayTokensActive ? (
            <div className="">
              <MyBoyz
                onStake={(tokenId) => {
                  onStake(tokenId, lot.lotNo);
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StakingModal;

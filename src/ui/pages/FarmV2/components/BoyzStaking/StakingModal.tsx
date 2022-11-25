import React, { useState } from "react";
import DisplayBoy from "../MyBoyz/DisplayBoy";
import { INetworkType } from "../../../../../packages/neo/network";
import { ILotState } from "./interfaces";
import MyBoyz from "../MyBoyz";

interface IStakingModalProps {
  lot: ILotState;
  network: INetworkType;
  onStake: (tokenId: string, lotNo: string) => void;
  onUnStake: (tokenId: string, lotNo: string) => void;
}
const StakingModal = ({ lot, network, onStake, onUnStake }: IStakingModalProps) => {
  const [isDisplayTokensActive, setDisplayTokensActive] = useState(false);
  return (
    <div className="">
      {lot ? (
        <div>
          <div className="box">
            <div className="media">
              <div className="media-left">
                <figure className="image is-128x128">
                  <DisplayBoy
                    onClick={() => {}}
                    network={network}
                    id={lot.tokenId}
                  />
                </figure>
              </div>
              <div className="media-content">
                <div className="content">
                  <h5>{`Slot #${lot.lotNo}`}</h5>
                  {lot.tokenId ? (
                    <>
                      Id: {lot.tokenId}
                      <br />
                      Tier: {lot.tier}
                      <br />
                      Stake at: {lot.createdAt}
                    </>
                  ) : (
                    <></>
                  )}
                  <p></p>
                </div>
              </div>
            </div>
          </div>
          <div className="buttons">
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
            <div className="box">
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

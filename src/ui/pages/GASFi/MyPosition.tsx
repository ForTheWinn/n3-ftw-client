import React from "react";
import { IFarmDepositRecord } from "../../../packages/neo/contracts/ftw/gas-fi/interfaces";

interface IMyPositionProps {
  deposit?: IFarmDepositRecord;
  lastSnapshotNo: string;
  onCancel: () => void;
  onPositionChange: () => void;
  onClaim: () => void;
}
const MyPosition = ({
  deposit,
  lastSnapshotNo,
  onCancel,
  onClaim,
  onPositionChange,
}: IMyPositionProps) => {
  if (!deposit) return <div></div>;
  const lastClaimNo = deposit.lastClaimNo ? parseFloat(deposit.lastClaimNo) : 0;
  const isClaimable = parseFloat(lastSnapshotNo) > lastClaimNo;
  return (
    <>
      <div className="level">
        <div className="level-left">
          <div className="level-item is-block">
            <div className="">
              My position
              <br />
              <span className="is-capitalized">
                {deposit.position} / {deposit.amount} NEO
              </span>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="buttons">
            {!isClaimable && (
              <button onClick={onPositionChange} className="button is-black">
                Change position
              </button>
            )}
            <button onClick={onCancel} className="button is-light">
              Close
            </button>
          </div>
        </div>
      </div>
      {isClaimable && (
        <button onClick={onClaim} className="button is-primary is-fullwidth">
          Claim Reward
        </button>
      )}
    </>
  );
};

export default MyPosition;

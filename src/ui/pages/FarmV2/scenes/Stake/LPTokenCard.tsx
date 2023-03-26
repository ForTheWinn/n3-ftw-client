import React from "react";
import { IFarmLPToken } from "../../../../../common/routers/farm/interfaces";
interface ILPTokenCardProps {
  LPToken: IFarmLPToken;
  onStake: (tokenId: string) => void;
}
const LPTokenCard = ({ LPToken, onStake }: ILPTokenCardProps) => {
  return (
    <div className="media">
      <div className="media-content">
        LP name: {LPToken.name}
        <br />
        <small>{` Share of pool / ${LPToken.sharesPercentage}%`}</small>
      </div>
      <div className="media-right">
        <button
          onClick={() => onStake(LPToken.tokenId)}
          className="button is-small is-primary"
        >
          Stake
        </button>
      </div>
    </div>
  );
};

export default LPTokenCard;

import React from "react";
import { IPrices } from "../../../../../packages/neo/api/interfaces";
import { IFarmLPToken } from "../../../../../common/routers/farm/interfaces";

interface IPositionCardProps {
  onUnStake: (tokenId: string) => void;
  prices?: IPrices;
  token: IFarmLPToken;
}
const PositionCard = ({ token, prices, onUnStake }: IPositionCardProps) => {
  return (
    <div className="media">
      <div className="media-content">
        {token.name}
        <br />
        <div className="content is-small">
          {`${token.amountA} ${token.symbolA}`}
          <br />
          {`${token.amountB} ${token.symbolB}`}
          <br />
        </div>
      </div>
      <div className="media-right">
        <button
          onClick={() => onUnStake(token.tokenId)}
          className="button is-light is-small"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default PositionCard;

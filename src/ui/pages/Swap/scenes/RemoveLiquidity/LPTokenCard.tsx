import React from "react";
import { IFarmLPToken } from "../../../../../common/routers/farm/interfaces";

interface ILPTokenCardProps {
  token: IFarmLPToken;
  onClick: () => void;
}
const LPTokenCard = ({ token, onClick }: ILPTokenCardProps) => {
  return (
    <div className="media">
      <div className="media-content">
        <p className="mb-2">
          <strong>Token Id: {token.tokenId}</strong>
          <br />
          <small>{`${token.amountA} ${token.symbolA}`}</small>
          <br />
          <small>{`${token.amountB} ${token.symbolB}`}</small>
          <br />
          <small>{token.sharesPercentage}%</small>
        </p>
      </div>
      <div className="media-right">
        <button onClick={onClick} className="button is-light is-small">
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default LPTokenCard;

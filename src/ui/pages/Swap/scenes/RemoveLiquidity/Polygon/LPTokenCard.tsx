import React from "react";

interface ILPTokenCard {
  tokenId: string;
  sharePercentage: string;
  tokenA: string;
  tokenB: string;
  onClick: () => void;
}
const LPTokenCard = ({
  tokenId,
  sharePercentage,
  tokenA,
  tokenB,
  onClick,
}: ILPTokenCard) => {
  return (
    <div className="media">
      <div className="media-content">
        <p className="mb-2">
          <strong>{tokenId}</strong>
          <br />
          <small>Share of pool / {sharePercentage}%</small>
          <br />
          <small>{`${tokenA} / ${tokenB}`}</small>
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

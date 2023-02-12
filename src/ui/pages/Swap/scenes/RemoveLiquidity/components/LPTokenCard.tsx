import React from "react";

interface ILPTokenCardProps {
  tokenId: string;
  sharePercentage: string;
  tokenAAmount: string;
  tokenBAmount: string;
  tokenASymbol: string;
  tokenBSymbol: string;
  onClick: () => void;
}
const LPTokenCard = ({
  tokenId,
  tokenAAmount,
  tokenBAmount,
  tokenASymbol,
  tokenBSymbol,
  sharePercentage,
  onClick,
}: ILPTokenCardProps) => {
  return (
    <div className="media">
      <div className="media-content">
        <p className="mb-2">
          <strong>Token Id: {tokenId}</strong>
          <br />
          <small>{`${tokenAAmount} ${tokenASymbol}`}</small>
          <br />
          <small>{`${tokenBAmount} ${tokenBSymbol}`}</small>
          <br />
          <small>{sharePercentage}%</small>
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

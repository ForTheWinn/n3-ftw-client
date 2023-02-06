import React from "react";
import { ITokenState } from "../scenes/Swap/interfaces";

interface ISwapTokenCardProps {
  onClick: (token: ITokenState) => void;
  token: ITokenState
}
const SwapTokenCard = ({
  token,
  onClick,
}: ISwapTokenCardProps) => {
  return (
    <div
      className="column is-2-desktop is-2-tablet is-3-mobile"
      onClick={() => onClick(token)}
      key={`assets-${token.hash}`}
    >
      <div className="box is-hoverable has-text-centered">
        <img
          style={{ width: "32px" }}
          src={token.icon}
          alt={`${token.symbol} logo`}
        />
        <span className="is-size-7 has-text-weight-semibold">
          {token.symbol}
        </span>
      </div>
    </div>
  );
};

export default SwapTokenCard;

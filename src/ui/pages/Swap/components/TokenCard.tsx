import React from "react";
import { ITokenState } from "../scenes/Swap/interfaces";
import Avatar from "antd/es/avatar/avatar";

interface ISwapTokenCardProps {
  onClick: (token: ITokenState) => void;
  token: ITokenState;
}
const SwapTokenCard = ({ token, onClick }: ISwapTokenCardProps) => {
  return (
    <div
      className="column is-2-desktop is-2-tablet is-3-mobile"
      onClick={() => onClick(token)}
    >
      <div className="box is-hoverable has-text-centered">
        <Avatar src={token.icon} />

        <p className="is-size-7 has-text-weight-semibold">{token.symbol}</p>
      </div>
    </div>
  );
};

export default SwapTokenCard;

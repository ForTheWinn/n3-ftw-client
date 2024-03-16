import React from "react";
import { IToken } from "../../../../consts/tokens";
import Avatar from "antd/es/avatar/avatar";

interface ISwapTokenCardProps {
  onClick: (token: IToken) => void;
  token: IToken;
}
const SwapTokenCard = ({ token, onClick }: ISwapTokenCardProps) => {
  return (
    <div className="media" onClick={() => onClick(token)}>
      <div className="media-left">
        <Avatar src={token.icon} />
        <p className="is-size-7 has-text-weight-semibold">{token.symbol}</p>
      </div>
    </div>
  );
};

export default SwapTokenCard;

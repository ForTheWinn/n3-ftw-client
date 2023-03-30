import React from "react";
import { IBalance } from "../../../../../packages/neo/wallets/interfaces";

const AssetCard = (props: IBalance) => {
  return (
    <div className="media">
      <div className="media-left">
        <strong>{props.symbol}</strong>
      </div>
      <div className="media-content"></div>
      <div className="media-right has-text-right">{props.amount}</div>
    </div>
  );
};

export default AssetCard;

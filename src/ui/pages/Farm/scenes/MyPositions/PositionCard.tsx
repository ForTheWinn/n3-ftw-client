import React, { useEffect, useState } from "react";
import { ILPToken } from "../../../../../packages/neo/contracts/ftw/swap/interfaces";
import { numberTrim } from "../../../../../packages/neo/utils";
import { INetworkType } from "../../../../../packages/neo/network";
import { IPrices } from "../../../../../packages/neo/api/interfaces";

interface IPositionCardProps extends ILPToken {
  network: INetworkType;
  prices: IPrices;
  createdAt: string;
  onUnStake: (tokenId: string) => void;
}
const PositionCard = ({
  tokenId,
  onUnStake,
  createdAt,
}: IPositionCardProps) => {
  const [reserves, setReserves] = useState<any>();

  return (
    <div className="media">
      <div className="media-content">
        <strong>{tokenId}</strong>
        <br />
        {reserves ? (
          <small>
            {`${numberTrim(reserves.tokenAAmount)} ${
              reserves.tokenASymbol
            } ($${numberTrim(reserves.tokenAUSD)})`}
            <br />
            {`${numberTrim(reserves.tokenBAmount)} ${
              reserves.tokenBSymbol
            } ($${numberTrim(reserves.tokenBUSD)})`}
            <br />
            {`$${numberTrim(reserves.tokenAUSD + reserves.tokenBUSD)}`}
          </small>
        ) : (
          <></>
        )}
        <br />
        <br />
        <small>Staked at {createdAt}</small>
      </div>
      <div className="media-right">
        <button onClick={() => onUnStake(tokenId)} className="button is-light">
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default PositionCard;

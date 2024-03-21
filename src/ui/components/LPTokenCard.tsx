import React from "react";
import { ISwapLPToken } from "../../common/routers/swap/interfaces";
import { formatAmount } from "../../common/helpers";

const LPTokenCard = (props: ISwapLPToken) => {
  const isLocked = props.lock && props.lock > new Date().getTime();
  return (
    <>
      <strong>Token Id: {props.tokenId}</strong>
      <>
        <br />
        <small>{`${parseFloat(
          formatAmount(props.amountA, props.decimalsA)
        ).toLocaleString()} ${props.symbolA}`}</small>
        <br />
        <small>{`${parseFloat(
          formatAmount(props.amountB, props.decimalsB)
        ).toLocaleString()} ${props.symbolB}`}</small>
        <br />
        <small>{parseFloat(props.sharesPercentage) / 100}%</small>
        {isLocked && props.lock && (
          <>
            <br />
            <small>Locked until {new Date(props.lock).toLocaleString()}</small>
          </>
        )}
      </>
    </>
  );
};

export default LPTokenCard;

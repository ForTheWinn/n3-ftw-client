import React from "react";
import { ISwapLPToken } from "../../common/routers/swap/interfaces";
import { formatAmount } from "../../common/helpers";

const LPTokenCard = (props: ISwapLPToken) => {
  return (
    <>
      <strong>Token Id: {props.tokenId}</strong>
      <>
        <br />
        <small>{`${formatAmount(props.amountA, props.decimalsA)} ${
          props.symbolA
        }`}</small>
        <br />
        <small>{`${formatAmount(props.amountB, props.decimalsB)} ${
          props.symbolB
        }`}</small>
        <br />
        <small>{parseFloat(props.sharesPercentage) / 100}%</small>
      </>
    </>
  );
};

export default LPTokenCard;

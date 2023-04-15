import React from "react";
import { ISwapLPToken } from "../../common/routers/swap/interfaces";
import { ethers } from "ethers";

const LPTokenCard = (props: ISwapLPToken) => {
  return (
    <>
      <strong>Token Id: {props.tokenId}</strong>
      <>
        <br />
        <small>{`${ethers.utils.formatUnits(
          props.amountA.toString(),
          props.decimalsA
        )} ${props.symbolA}`}</small>
        <br />
        <small>{`${ethers.utils.formatUnits(
          props.amountB.toString(),
          props.decimalsB
        )} ${props.symbolB}`}</small>
        <br />
        <small>{parseFloat(props.sharesPercentage) / 100}%</small>
      </>
    </>
  );
};

export default LPTokenCard;

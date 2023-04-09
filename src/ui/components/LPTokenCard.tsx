import React, { useEffect, useState } from "react";
import { ISwapLPToken } from "../../common/routers/swap/interfaces";
import { CHAINS } from "../../consts/chains";
import { INetworkType } from "../../packages/neo/network";
import { globalRouter, swapRouter } from "../../common/routers";
import { u } from "@cityofzion/neon-core";
import { ethers } from "ethers";

const LPTokenCard = (props: ISwapLPToken) => {
  return (
    <>
      <strong>Token Id: {props.tokenId}</strong>
      <>
        <br />
        <small>{`${ethers.utils.formatUnits(props.amountA, props.decimalsA)} ${
          props.symbolA
        }`}</small>
        <br />
        <small>{`${ethers.utils.formatUnits(props.amountB, props.decimalsB)} ${
          props.symbolB
        }`}</small>
        <br />
        <small>{parseFloat(props.sharesPercentage) / 100}%</small>
      </>
    </>
  );
};

export default LPTokenCard;

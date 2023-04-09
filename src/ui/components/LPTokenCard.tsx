import React, { useEffect, useState } from "react";
import { ISwapLPToken } from "../../common/routers/swap/interfaces";
import { CHAINS } from "../../consts/chains";
import { INetworkType } from "../../packages/neo/network";
import { globalRouter, swapRouter } from "../../common/routers";
import { u } from "@cityofzion/neon-core";
import { ethers } from "ethers";

const LPTokenCard = (props: ISwapLPToken) => {
  // const [amountA, setAmountA] = useState<string | undefined>();
  // const [amountB, setAmountB] = useState<string | undefined>();
  // const [sharesPercentage, setSharePercentage] = useState<string | undefined>();
  // useEffect(() => {
  //   async function fetch() {
  //     try {
  //       const reserves = await swapRouter.getReserves(
  //         chain,
  //         network,
  //         token.tokenA,
  //         token.tokenB
  //       );
  //       let tokenADecimals;
  //       let tokenBDecimals;

  //       console.log(reserves)
  //       console.log(token)

  //       if (token.decimalsA) {
  //         tokenADecimals = token.decimalsA;
  //       } else {
  //         if (reserves.decimalsA) {
  //           tokenADecimals = reserves.decimalsA;
  //         }
  //       }

  //       if (token.decimalsB) {
  //         tokenBDecimals = token.decimalsB;
  //       } else {
  //         if (reserves.decimalsB) {
  //           tokenBDecimals = reserves.decimalsB;
  //         }
  //       }

  //       if (tokenADecimals && tokenBDecimals) {
  //         setAmountA(
  //           u.BigInteger.fromNumber(reserves.reserveA)
  //             .mul(parseFloat(token.shares))
  //             .div(parseFloat(reserves.shares))
  //             .toDecimal(tokenADecimals)
  //         );
  //         setAmountB(
  //           u.BigInteger.fromNumber(reserves.reserveB)
  //             .mul(parseFloat(token.shares))
  //             .div(parseFloat(reserves.shares))
  //             .toDecimal(tokenBDecimals)
  //         );
  //         setSharePercentage(
  //           (
  //             parseFloat(token.shares) /
  //             parseFloat(reserves.shares) *
  //             100
  //           ).toFixed(2)
  //         );
  //       }
  //     } catch (e: any) {
  //       console.error(e);
  //     }
  //   }
  //   fetch();
  // }, []);
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
      {/* ) : (
        <></>
      )} */}
    </>
  );
};

export default LPTokenCard;

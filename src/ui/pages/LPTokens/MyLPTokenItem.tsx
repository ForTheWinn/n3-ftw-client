import React, { useEffect, useState } from "react";
import { SwapContract } from "../../../packages/neo/contracts";
import { ILPToken } from "../../../packages/neo/contracts/ftw/swap/interfaces";
import { u } from "@cityofzion/neon-core";
import { INetworkType } from "../../../packages/neo/network";
import MyLPTokenCard from "./MyLPTokenCard";
interface IMyTokenItemProps {
  network: INetworkType;
  token: ILPToken;
  prices: object;
}
const MyLPTokenItem = ({ network, token, prices }: IMyTokenItemProps) => {
  const [data, setData] = useState<any>();
  // useEffect(() => {
  //   async function getReserves() {
  //     try {
  //       const info: any = await new SwapContract(network).getProperties(
  //         token.tokenId
  //       );
  //       const reserve = await new SwapContract(network).getReserve(
  //         info.tokenA,
  //         info.tokenB
  //       );
  //       const tokenAPrice = prices ? prices["0x" + info.tokenA] : 0;
  //       const tokenBPrice = prices ? prices["0x" + info.tokenB] : 0;
  //       let tokenAReserve = reserve.reserveA;
  //       let tokenBReserve = reserve.reserveB;
  //       let tokenAAmount = parseFloat(
  //         u.BigInteger.fromNumber(tokenAReserve)
  //           .mul(info.amount)
  //           .div(parseFloat(reserve.shares))
  //           .toDecimal(reserve.pair[info.tokenA].decimals)
  //       );
  //       let tokenBAmount = parseFloat(
  //         u.BigInteger.fromNumber(tokenBReserve)
  //           .mul(info.amount)
  //           .div(reserve.totalShare)
  //           .toDecimal(reserve.pair[info.tokenB].decimals)
  //       );
  //       setData({
  //         tokenASymbol: reserve.pair[info.tokenA].symbol,
  //         tokenBSymbol: reserve.pair[info.tokenB].symbol,
  //         tokenAAmount,
  //         tokenBAmount,
  //         tokenAUSD: tokenAAmount * tokenAPrice,
  //         tokenBUSD: tokenBAmount * tokenBPrice
  //       });
  //     } catch (e: any) {
  //       console.log(e);
  //     }
  //   }
  //   getReserves();
  // }, []);

  if (!data) return <></>;
  return (
    <div className="media">
      <div className="media-content">
        <MyLPTokenCard
          tokenId={token.tokenId}
          tokenASymbol={data.tokenASymbol}
          tokenAAmount={data.tokenAAmount}
          tokenAUSD={data.tokenAUSD}
          tokenBSymbol={data.tokenBSymbol}
          tokenBAmount={data.tokenBAmount}
          tokenBUSD={data.tokenBUSD}
        />
      </div>
    </div>
  );
};

export default MyLPTokenItem;

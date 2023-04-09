import React, { useEffect, useState } from "react";
import { ILPToken } from "../../../../../packages/neo/contracts/ftw/swap/interfaces";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { u } from "@cityofzion/neon-core";
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
  network,
  tokenA,
  tokenB,
  tokenId,
  amount,
  onUnStake,
  prices,
  createdAt,
}: IPositionCardProps) => {
  const [reserves, setReserves] = useState<any>();
  // useEffect(() => {
  //   async function getReserves() {
  //     try {
  //       const reserve = await new SwapContract(network).getReserve(
  //         tokenA,
  //         tokenB
  //       );
  //       const tokenAPrice = prices ? prices["0x" + tokenA] : 0;
  //       const tokenBPrice = prices ? prices["0x" + tokenB] : 0;
  //       let tokenAReserve = reserve.pair[tokenA].reserveAmount;
  //       let tokenBReserve = reserve.pair[tokenB].reserveAmount;
  //       let tokenAAmount = parseFloat(
  //         u.BigInteger.fromNumber(tokenAReserve)
  //           .mul(amount)
  //           .div(reserve.totalShare)
  //           .toDecimal(reserve.pair[tokenA].decimals)
  //       );
  //       let tokenBAmount = parseFloat(
  //         u.BigInteger.fromNumber(tokenBReserve)
  //           .mul(amount)
  //           .div(reserve.totalShare)
  //           .toDecimal(reserve.pair[tokenB].decimals)
  //       );
  //       setReserves({
  //         tokenASymbol: reserve.pair[tokenA].symbol,
  //         tokenBSymbol: reserve.pair[tokenB].symbol,
  //         tokenAAmount,
  //         tokenBAmount,
  //         tokenAUSD: tokenAAmount * tokenAPrice,
  //         tokenBUSD: tokenBAmount * tokenBPrice,
  //       });
  //     } catch (e: any) {
  //       console.error(e);
  //     }
  //   }
  //   getReserves();
  // }, []);

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
        {/*<small>Share of pool: {((amount / TVL) * 100).toFixed(2)}%</small>*/}
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

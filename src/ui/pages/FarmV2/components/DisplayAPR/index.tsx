import { u } from "@cityofzion/neon-core";
import React from "react";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { farmRouter } from "../../../../../common/routers";
import { CHAINS } from "../../../../../packages/chains/consts";
import { IPrices } from "../../../../../packages/neo/api/interfaces";
import { IPoolEnhanced } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { INetworkType } from "../../../../../packages/neo/network";
import { numberTrim } from "../../../../../packages/neo/utils";

interface IDisplayAPRProps extends IPoolEnhanced {
  tokenA: string;
  tokenB: string;
  chain: CHAINS;
  network: INetworkType;
  prices: IPrices;
  nepPrice: number;
}

const ONE_YEAR_IN_SECONDS = 31536000;
const DisplayAPR = ({
  chain,
  network,
  tokenA,
  tokenB,
  nepTokensPerSecond,
  bonusTokensPerSecond,
  bonusToken,
  bonusTokenDecimals,
  tokensStaked,
  prices,
  nepPrice
}: IDisplayAPRProps) => {
  console.log(tokenA);
  const { data, error } = useOnChainData(
    () => farmRouter.getReserves(chain, network, tokenA, tokenB),
    []
  );

  if (!data) return <></>;
  if (!prices[tokenA]) return <></>;
  if (!prices[tokenB]) return <></>;

  let tokenAReserveAmount = parseFloat(
    u.BigInteger.fromNumber(data.pair[tokenA].reserveAmount)
      .mul(tokensStaked > 0 ? tokensStaked : 1)
      .div(data.totalShare)
      .toDecimal(data.pair[tokenA].decimals)
  );

  let tokenBReserveAmount = parseFloat(
    u.BigInteger.fromNumber(data.pair[tokenB].reserveAmount)
      .mul(tokensStaked > 0 ? tokensStaked : 1)
      .div(data.totalShare)
      .toDecimal(data.pair[tokenB].decimals)
  );

  const TVL =
    tokenAReserveAmount * prices[tokenA] + tokenBReserveAmount * prices[tokenB];

  const NEP_APR =
    parseFloat(
      u.BigInteger.fromNumber(
        nepTokensPerSecond * ONE_YEAR_IN_SECONDS
      ).toDecimal(8)
    ) * nepPrice;

  const BONUS_APR =
    bonusTokensPerSecond > 0
      ? parseFloat(
          u.BigInteger.fromNumber(
            bonusTokensPerSecond * ONE_YEAR_IN_SECONDS
          ).toDecimal(bonusTokenDecimals)
        ) * prices[bonusToken]
      : 0;

  const APR = ((NEP_APR + BONUS_APR) / TVL) * 100;

  return <>{numberTrim(APR)}%</>;
};

export default DisplayAPR;

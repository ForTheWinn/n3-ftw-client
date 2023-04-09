import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { IPoolEnhanced } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { Space, Avatar } from "antd";
import { NEO_ROUTES } from "../../../../../consts";
import { useApp } from "../../../../../common/hooks/use-app";

interface IStakingPairCardProps extends IPoolEnhanced {
  path: string;
}

const StakingPairCard = ({
  path,
  tokenA,
  tokenB,
  tokenASymbol,
  tokenBSymbol,
  tokenALogo,
  tokenBLogo,
  nepRewardsPerDay,
  bonusRewardsPerDay,
  hasBonusRewards,
  bonusTokenSymbol
}: IStakingPairCardProps) => {
  const { network } = useApp();
  const [isExpanded, setExpanded] = useState(false);

  // useEffect(() => {
  //   async function fetch() {
  //     setError("");
  //     setLoading(true);
  //     try {
  //       const pairDay = await new RestAPI(network).getPairDay(
  //         `0x${tokenA}_0x${tokenB}`
  //       );
  //       const reserve = await new SwapContract(network).getReserve(
  //         tokenA,
  //         tokenB
  //       );
  //       setData({
  //         pairDay,
  //         reserve,
  //       });
  //       setLoading(false);
  //     } catch (e: any) {
  //       setError(e.message);
  //       setLoading(false);
  //     }
  //   }
  //   fetch();
  // }, []);


  // let nepPerSecond = parseFloat(
  //   u.BigInteger.fromNumber(nepTokensPerSecond).toDecimal(8)
  // );
  // let bonusPerSecond = parseFloat(
  //   u.BigInteger.fromNumber(bonusTokensPerSecond).toDecimal(bonusTokenDecimals)
  // );

  // let tokenAReserveAmount = data
  //   ? parseFloat(
  //       u.BigInteger.fromNumber(data.reserve.pair[tokenA].reserveAmount)
  //         .mul(tokensStaked > 0 ? tokensStaked : 1)
  //         .div(data.reserve.totalShare)
  //         .toDecimal(data.reserve.pair[tokenA].decimals)
  //     )
  //   : 0;

  // let tokenBReserveAmount = data
  //   ? parseFloat(
  //       u.BigInteger.fromNumber(data.reserve.pair[tokenB].reserveAmount)
  //         .mul(tokensStaked > 0 ? tokensStaked : 1)
  //         .div(data.reserve.totalShare)
  //         .toDecimal(data.reserve.pair[tokenB].decimals)
  //     )
  //   : 0;

  // const TVL =
  //   tokenAReserveAmount * tokenAPrice + tokenBReserveAmount * tokenBPrice;

  // const stakeAPR =
  //   ((nepPerSecond * 31536000 * nepPrice +
  //     bonusPerSecond * bonusTokenPrice * 31536000) /
  //     TVL) *
  //   100;

  // const feeAPR = data ? ((data.pairDay.dailyFeesUSD * 365) / TVL) * 100 : 0;

  // const totalAPR = stakeAPR + feeAPR;

  return (
    <>
      <tr>
        <td>
          <Space>
            <Avatar size="small" src={tokenALogo} />
            <Avatar size="small" src={tokenBLogo} />
            <small>
              {tokenASymbol} / {tokenBSymbol}
            </small>
          </Space>
        </td>
        <td>
          {`${nepRewardsPerDay} NEP`}
          <br />
          {hasBonusRewards && (
            <>{`${bonusRewardsPerDay} ${bonusTokenSymbol}`}</>
          )}
        </td>
        {/* <td>
          <button
            onClick={() => setExpanded(!isExpanded)}
            className="button is-white is-small"
          >
            <span style={{ minWidth: "60px" }} className="has-text-success">
              {isLoading
                ? "Loading.."
                : data
                ? totalAPR > 0
                  ? numberTrim(totalAPR) + "%"
                  : "--"
                : "--"}
            </span>

            <span className="icon is-small">
              <FaAngleDown />
            </span>
          </button>
        </td> */}
        <td className="has-text-right">
          <Link
            to={`${NEO_ROUTES.FARM_V2_STAKE_PATH}?tokenA=${tokenA}&tokenB=${tokenB}&tokenASymbol=${tokenASymbol}&tokenBSymbol=${tokenBSymbol}`}
            className="button is-primary is-small"
          >
            Stake
          </Link>
        </td>
      </tr>
      {/* {isExpanded && (
        <tr className="">
          <td colSpan={4} className="">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item is-block">
                  <div className="heading">Stake APR</div>
                  {numberTrim(stakeAPR)}%
                </div>
                <div className="level-item has-text-weight-bold">+</div>
                <div className="level-item is-block">
                  <div className="heading">Fee APR</div>
                  {numberTrim(feeAPR)}%
                </div>
                <div className="level-item has-text-weight-bold">=</div>
                <div className="level-item is-block">
                  <div className="heading">Total APR</div>
                  {numberTrim(totalAPR)}%
                </div>
              </div>
            </div>
          </td>
        </tr>
      )} */}
    </>
  );
};

export default StakingPairCard;

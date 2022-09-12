import React, { useEffect, useState } from "react";
import { FARM_V2_STAKE_PATH } from "../../../../../consts";
import { Link } from "react-router-dom";
import PairIcons from "../../../../components/PairIcons";
import { useWallet } from "../../../../../packages/provider";
import { IPool } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { u } from "@cityofzion/neon-core";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { numberTrim } from "../../../../../packages/neo/utils";
import { FaAngleDown } from "react-icons/fa";
import { RestAPI } from "../../../../../packages/neo/api";

interface IStakingPairCardProps extends IPool {
  tokenAPrice: number;
  tokenBPrice: number;
  nepPrice: number;
  bonusTokenPrice: number;
}
const StakingPairCard = ({
  tokenA,
  tokenB,
  tokenASymbol,
  tokenBSymbol,
  tokensStaked,
  bonusToken,
  nepTokensPerSecond,
  bonusTokensPerSecond,
  bonusTokenSymbol,
  tokenAPrice,
  tokenBPrice,
  nepPrice,
  bonusTokenPrice,
  bonusTokenDecimals,
}: IStakingPairCardProps) => {
  const { network } = useWallet();
  const [data, setData] = useState<any>();
  const [isExpanded, setExpanded] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetch() {
      setError("");
      setLoading(true);
      try {
        const pairDay = await new RestAPI(network).getPairDay(
          `0x${tokenA}_0x${tokenB}`
        );
        const reserve = await new SwapContract(network).getReserve(
          tokenA,
          tokenB
        );
        setData({
          pairDay,
          reserve,
        });
        setLoading(false);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, []);

  console.log(`${tokenASymbol}-${tokenBSymbol}, staked: ${tokensStaked}`);

  let nepPerSecond = parseFloat(
    u.BigInteger.fromNumber(nepTokensPerSecond).toDecimal(8)
  );
  let bonusPerSecond = parseFloat(
    u.BigInteger.fromNumber(bonusTokensPerSecond).toDecimal(bonusTokenDecimals)
  );

  let tokenAReserveAmount = data
    ? parseFloat(
        u.BigInteger.fromNumber(data.reserve.pair[tokenA].reserveAmount)
          .mul(tokensStaked > 0 ? tokensStaked : 1)
          .div(data.reserve.totalShare)
          .toDecimal(data.reserve.pair[tokenA].decimals)
      )
    : 0;

  let tokenBReserveAmount = data
    ? parseFloat(
        u.BigInteger.fromNumber(data.reserve.pair[tokenB].reserveAmount)
          .mul(tokensStaked > 0 ? tokensStaked : 1)
          .div(data.reserve.totalShare)
          .toDecimal(data.reserve.pair[tokenB].decimals)
      )
    : 0;

  const TVL =
    tokenAReserveAmount * tokenAPrice + tokenBReserveAmount * tokenBPrice;

  const stakeAPR =
    ((nepPerSecond * 31536000 * nepPrice +
      bonusPerSecond * bonusTokenPrice * 31536000) /
      TVL) *
    100;

  const feeAPR = data ? ((data.pairDay.dailyFeesUSD * 365) / TVL) * 100 : 0;

  const totalAPR = stakeAPR + feeAPR;

  return (
    <>
      <tr>
        <td>
          <div className="is-flex">
            <PairIcons
              network={network}
              tokenA={tokenA}
              tokenB={tokenB}
              width="20px"
              height="20px"
            />
            <div className="ml-2">
              <strong>
                {tokenASymbol} / {tokenBSymbol}
              </strong>
            </div>
          </div>
        </td>
        <td>
          <div className="is-center" style={{ justifyContent: "start" }}>
            {nepPerSecond * 86400} NEP
          </div>
          {bonusPerSecond > 0 ? (
            <div className="is-center" style={{ justifyContent: "start" }}>
              {numberTrim(bonusPerSecond * 86400)} {bonusTokenSymbol}
            </div>
          ) : (
            <></>
          )}
        </td>
        <td>
          <button
            onClick={() => setExpanded(!isExpanded)}
            className="button is-white is-small"
          >
            <span
              style={{ minWidth: "60px" }}
              className="has-text-success"
            >
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
        </td>
        <td className="has-text-right">
          <Link
            to={`${FARM_V2_STAKE_PATH}?tokenA=${tokenA}&tokenB=${tokenB}&tokenASymbol=${tokenASymbol}&tokenBSymbol=${tokenBSymbol}`}
            className="button is-primary is-small"
          >
            Stake
          </Link>
        </td>
      </tr>
      {isExpanded && (
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
      )}
    </>
  );
};

export default StakingPairCard;

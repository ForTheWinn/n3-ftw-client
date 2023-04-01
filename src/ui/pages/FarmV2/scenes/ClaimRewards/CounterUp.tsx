import { u } from "@cityofzion/neon-core";
import React, { useEffect, useState } from "react";
import { numberTrim } from "../../../../../packages/neo/utils";
interface ICounterUpProps {
  symbol: string;
  pricePerToken: number;
  bonus: number;
  claimable: string;
  rewardsPerSecond: string;
  tokensStaked: string;
  share: string;
}
const CounterUp = ({
  claimable,
  rewardsPerSecond,
  symbol,
  tokensStaked,
  share,
  pricePerToken,
  bonus
}: ICounterUpProps) => {
  const [timeElapsed, setTimeElapsed] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timeElapsed]);
  const rewards = u.BigInteger.fromNumber(rewardsPerSecond)
    .mul(parseFloat(share))
    .div(parseFloat(tokensStaked))
    .mul(timeElapsed)
    .add(parseFloat(claimable))
    .toDecimal(8);

  const bonusReward = (parseFloat(rewards) * bonus) / 100;

  return (
    <div className="has-text-right">
      {`${rewards} ${symbol}`}
      {bonus > 0 ? (
        <>
          <br />
          {`+${numberTrim(bonusReward, 8)} ${symbol}`}
        </>
      ) : (
        <></>
      )}
      <br />${numberTrim((parseFloat(rewards) + bonusReward) * pricePerToken)}
    </div>
  );
};

export default CounterUp;

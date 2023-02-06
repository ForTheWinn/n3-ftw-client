import React from "react";
import { SWAP_FEE } from "../../../../../../packages/neo/contracts/ftw/swap/consts";

const LPRewardInfo = (props) => {
  return (
    <div className="notification is-info">
      <strong>Liquidity Provider Rewards</strong>
      <br />
      Liquidity providers earn a {SWAP_FEE}% fee on all trades proportional to
      their share of the pool. Fees are added to the pool, accrue in real time
      and can be claimed by withdrawing your liquidity.
    </div>
  );
};

export default LPRewardInfo;

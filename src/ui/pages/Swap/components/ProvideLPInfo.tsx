import React from "react";
import { Link } from "react-router-dom";
import { SWAP_FEE } from "../../../../packages/neo/contracts/ftw/swap/consts";

interface IProvideLPInfoProps {
  path?: any;
}
const ProvideLPInfo = ({ path }: IProvideLPInfoProps) => {
  return (
    <>
      <div className="notification is-info is-light mb-1">
        <strong>No liquidity with this pair</strong>
        <br />
        Liquidity providers earn a {SWAP_FEE}% fee on all trades proportional to
        their share of the pool. Fees are added to the pool, accrue in real time
        and can be claimed by withdrawing your liquidity.
        <br />
        <br />
        {path ? (
          <Link className="button is-info is-inverted" to={path}>
            Provide liquidity
          </Link>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ProvideLPInfo;

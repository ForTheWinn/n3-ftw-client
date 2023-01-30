import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../../../consts";
import { SWAP_FEE } from "../../../../../../../packages/neo/contracts/ftw/swap/consts";

const NoLPInfo = ({ tokenA, tokenB }) => {
  const { path } = useRouteMatch();
  return (
    <>
      <div className="notification is-info">
        <strong>No liquidity with this pair</strong>
        <br />
        Liquidity providers earn a {SWAP_FEE}% fee on all trades proportional to
        their share of the pool. Fees are added to the pool, accrue in real time
        and can be claimed by withdrawing your liquidity.
        <br />
        <br />
        <Link
          className="button is-info is-inverted"
          to={
            tokenA && tokenB
              ? `${
                  path + SWAP_PATH_LIQUIDITY_ADD
                }?tokenA=${tokenA}&tokenB=${tokenB}`
              : path + SWAP_PATH_LIQUIDITY_ADD
          }
        >
          Provide liquidity
        </Link>
      </div>
      <hr />
    </>
  );
};

export default NoLPInfo;

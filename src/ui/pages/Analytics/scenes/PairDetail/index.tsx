import React, { useEffect, useState } from "react";
import SwapHistory from "./SwapHistory";
import LiquidityChart from "../NEOAnalytics/LiquidityChart";
import { useApp } from "../../../../../common/hooks/use-app";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../packages/neo/api";

interface IPairDetailProps {
  id: string;
}
const PairDetail = ({ id }: IPairDetailProps) => {
  const { network } = useApp();
  const pairs = id.split("_");
  const tokenA = pairs[0];
  const tokenB = pairs[1];

  const { data } = useOnChainData(() => {
    return new RestAPI(network).getPair(id);
  }, [network]);

  return (
    <>
      {data ? (
        <div>
          <div className="columns is-multiline">
            <div className="column is-6">
              <div className="box is-shadowless">
                <h1 className="title is-6">Liquidity</h1>
                <LiquidityChart id={id} days="15" />
              </div>
            </div>
            <div className="column is-6">
              <div className="box is-shadowless">
                <h1 className="title is-6">Swap history</h1>
                <SwapHistory
                  tokenA={tokenA}
                  tokenB={tokenB}
                  network={network}
                  pairs={{
                    [data.tokenA.id]: {
                      ...data.tokenA,
                    },
                    [data.tokenB.id]: {
                      ...data.tokenB,
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default PairDetail;

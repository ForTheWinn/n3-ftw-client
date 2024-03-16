import React from "react";
import { IToken } from "../../../../../../../consts/tokens";
import { findTradePaths } from "../../../../../../../common/helpers";
import { CHAINS } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";
import DisplaySwapPath from "./DisplaySwapPath";
import { Collapse } from "antd";

interface IPriceComparisonProps {
  tokenA: IToken;
  tokenB: IToken;
  amountIn: string;
  chain: CHAINS;
  network: INetworkType;
}

const PriceComparison = ({
  chain,
  network,
  tokenA,
  tokenB,
  amountIn,
}: IPriceComparisonProps) => {
  const paths: IToken[][] = findTradePaths(chain, network, tokenA, tokenB);
  if (!paths || paths.length === 0) return <></>;
  return (
    <div className="mt-1">
      <Collapse
        size="small"
        bordered={false}
        style={{ background: "white" }}
        items={[
          {
            key: "1",
            label: "Optimal Swap Routes",
            children: (
              <>
                {paths.map((path, i) => {
                  return (
                    <DisplaySwapPath
                      key={"path" + i}
                      chain={chain}
                      network={network}
                      path={path}
                      amountIn={amountIn}
                    />
                  );
                })}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PriceComparison;

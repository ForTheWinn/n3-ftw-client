import React from "react";

import { CaretRightOutlined } from "@ant-design/icons";
import { ITokenState } from "../../interfaces";
import { findTradePaths } from "../../../../../../../helpers/helpers";
import { TOKEN_LIST } from "../../../../../../../consts/tokens";
import { CHAINS } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";
import DisplaySwapPath from "./DisplaySwapPath";
import { Collapse } from "antd";
const { Panel } = Collapse;

interface IPriceComparisonProps {
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountIn: string;
  chain: CHAINS;
  network: INetworkType;
}

const PriceComparison = ({
  chain,
  network,
  tokenA,
  tokenB,
  amountIn
}: IPriceComparisonProps) => {
  const paths: ITokenState[][] = findTradePaths(
    TOKEN_LIST[chain][network],
    tokenA,
    tokenB
  );
  if (!paths) return <></>;
  if (paths.length === 0) return <></>;
  return (
    <div className="mt-1">
      <Collapse
        size="small"
        bordered={false}
        defaultActiveKey={[]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{ background: "white" }}
      >
        <Panel header={"Optimal swap routes"} key="1">
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
        </Panel>
      </Collapse>
    </div>
  );
};

export default PriceComparison;

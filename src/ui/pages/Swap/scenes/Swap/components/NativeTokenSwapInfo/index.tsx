import React from "react";
import { Collapse } from "antd";
const { Panel } = Collapse;

import { IToken } from "../../../../../../../consts/tokens";

const NoPairMessage = ({
  isUnWrapping,
  tokenA,
  tokenB,
}: {
  isUnWrapping: boolean;
  tokenA: IToken;
  tokenB: IToken;
}) => {
  return (
    <div className="mt-1">
      <Collapse
        size="small"
        bordered={false}
        defaultActiveKey={[]}
        style={{ background: "white" }}
      >
        <Panel
          header={
            isUnWrapping
              ? `Converting ${tokenA?.symbol} to ${tokenB?.symbol}`
              : `Converting ${tokenA?.symbol} to ${tokenB?.symbol}`
          }
          key="1"
        >
          We use bNEO contract to wrap and unwrap NEO.
        </Panel>
      </Collapse>
    </div>
  );
};

export default NoPairMessage;

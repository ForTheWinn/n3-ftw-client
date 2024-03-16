import React from "react";
import { Collapse, Typography } from "antd";

import { IToken } from "../../../../../../../consts/tokens";

const NativeTokenInfo = ({
  tokenA,
  tokenB,
}: {
  tokenA: IToken;
  tokenB: IToken;
}) => {
  let symbol;
  if (tokenA.nativePair) {
    symbol = tokenA.nativePair.symbol;
  }
  if (tokenB.nativePair) {
    symbol = tokenB.nativePair.symbol;
  }
  return (
    <Collapse
      bordered={false}
      style={{ background: "white" }}
      className="has-background-danger mt-1"
      items={[
        {
          key: "1",
          label: (
            <Typography.Text className="has-text-white">
              Native Token Info
            </Typography.Text>
          ),
          children: (
            <Typography.Text className="has-text-white">
              Native token can't be a pair. Please use its wrap token
            </Typography.Text>
          ),
        },
      ]}
    />
  );
};

export default NativeTokenInfo;

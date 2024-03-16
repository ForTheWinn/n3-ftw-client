import React from "react";
import { Collapse } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { SWAP_FEE } from "../../../../../../../packages/neo/contracts/ftw/swap/consts";
const NativeTokenSwapInfo = () => {
  return (
    <div className="mt-1">
      <Collapse
        size="small"
        bordered={false}
        defaultActiveKey={[]}
        className="has-background-info"
        expandIcon={({ isActive }) => (
          <QuestionCircleOutlined className="has-text-white" />
        )}
        items={[
          {
            key: "1",
            label: (
              <span className="has-text-white">
                There is no liquidity with this pair
              </span>
            ),
            children: (
              <span className="has-text-white">
                There is no liquidity with this pair. You can provide liquidity
                to this pool and earn fees. Liquidity providers earn a{" "}
                {SWAP_FEE}% fee on all trades proportional to their share of the
                pool. Fees are added to the pool, accrue in real time and can be
                claimed by withdrawing your liquidity.
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};

export default NativeTokenSwapInfo;

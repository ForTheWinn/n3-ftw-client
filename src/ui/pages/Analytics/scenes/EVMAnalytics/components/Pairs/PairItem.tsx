import React from "react";
import { Avatar, Button, Space, Typography } from "antd";
import { CHAINS } from "../../../../../../../consts/chains";
import { MAINNET } from "../../../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../../../consts/tokens";
import { toDecimal } from "../../../../../../../packages/neo/utils";
import { formatUnits, parseUnits } from "viem";
interface IPairItem {
  chain: CHAINS;
  defaultToken: string;
  data: {
    tokenA: string;
    tokenB: string;
    reserves: {
      amountA: string;
      amountB: string;
    };
  };
  onClick: (val: string[]) => void;
}
const PairItem = ({ defaultToken, chain, data, onClick }: IPairItem) => {
  let tokenA = TOKEN_LIST[chain][MAINNET][data.tokenA];
  let tokenB = TOKEN_LIST[chain][MAINNET][data.tokenB];

  if (tokenA === undefined || tokenB === undefined) return null;
  return (
    <Space
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Space size="large">
        <Space size="small">
          <Avatar
            size={"small"}
            src={defaultToken === tokenA.hash ? tokenA.icon : tokenB.icon}
          />
          <Avatar
            size={"small"}
            src={defaultToken === tokenA.hash ? tokenB.icon : tokenA.icon}
          />
        </Space>

        <div>
          <div>
            <Typography.Text>
              {toDecimal(
                data.reserves.amountA,
                tokenA.decimals
              ).toLocaleString()}{" "}
            </Typography.Text>
            <Typography.Text strong>{tokenA.symbol}</Typography.Text>
          </div>
          <div>
            <Typography.Text>
              {toDecimal(
                data.reserves.amountB,
                tokenB.decimals
              ).toLocaleString()}{" "}
            </Typography.Text>
            <Typography.Text strong> {tokenB.symbol}</Typography.Text>
          </div>
        </div>
      </Space>
      <Button onClick={() => onClick([data.tokenA, data.tokenB])} size="small">
        View
      </Button>
    </Space>
  );
};

export default PairItem;

import React from "react";
import { Avatar, Button, Space, Typography } from "antd";
import { CHAINS } from "../../../../../../../consts/chains";
import { MAINNET } from "../../../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../../../consts/tokens";
interface IPairItem {
  chain: CHAINS;
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
const PairItem = ({ chain, data, onClick }: IPairItem) => {
  let tokenA = TOKEN_LIST[chain][MAINNET][data.tokenA];
  let tokenB = TOKEN_LIST[chain][MAINNET][data.tokenB];

  return (
    <Space style={{ display: "flex", justifyContent: "space-between" }}>
      <Space>
        <Avatar size={"small"} src={tokenA.icon} />
        <Avatar size={"small"} src={tokenB.icon} />
        <div>
          <div>
            <Typography.Text>{data.reserves.amountA} </Typography.Text>
            <Typography.Text strong>{tokenA.symbol}</Typography.Text>
          </div>
          <div>
            <Typography.Text>{data.reserves.amountB} </Typography.Text>
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

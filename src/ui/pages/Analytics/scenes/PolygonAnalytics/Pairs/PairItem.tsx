import React from "react";
import { Avatar, Space, Typography } from "antd";
import { CHAINS } from "../../../../../../consts/chains";
import { MAINNET } from "../../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../../consts/tokens";
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
  // onClick: () => void;
}
const PairItem = ({ chain, data }: IPairItem) => {
  let tokenA = TOKEN_LIST[chain][MAINNET][data.tokenA];
  let tokenB = TOKEN_LIST[chain][MAINNET][data.tokenB];

  return (
    <Space>
      <Avatar size={"small"} src={tokenA.icon} />
      <Avatar size={"small"} src={tokenB.icon} />
      <Typography.Text>{data.reserves.amountA} </Typography.Text>
      <Typography.Text strong>{tokenA.symbol}</Typography.Text>
      <Typography.Text>{data.reserves.amountB} </Typography.Text>
      <Typography.Text strong> {tokenB.symbol}</Typography.Text>
    </Space>
  );
};

export default PairItem;

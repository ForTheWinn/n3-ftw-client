import React from "react";
import { Avatar, Button, Space, Typography } from "antd";
import { CHAINS } from "../../../../../../../consts/chains";
import { MAINNET } from "../../../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../../../consts/tokens";
interface ITokenItem {
  chain: CHAINS;
  data: {
    token: string;
    liquidity: string;
  };
  onClick: (val: string[]) => void;
}
const PairItem = ({ chain, data, onClick }: ITokenItem) => {
  let token = TOKEN_LIST[chain][MAINNET][data.token];

  return (
    <Space style={{ display: "flex", justifyContent: "space-between" }}>
      <Space>
        <Avatar size={"small"} src={token.icon} />
        <Typography.Text>{data.liquidity} </Typography.Text>
        <Typography.Text strong>{token.symbol}</Typography.Text>
      </Space>
      <Button onClick={() => onClick([token.hash])} size="small">
        View
      </Button>
    </Space>
  );
};

export default PairItem;

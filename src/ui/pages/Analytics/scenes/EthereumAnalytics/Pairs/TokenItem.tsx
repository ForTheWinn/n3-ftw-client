import React from "react";
import { Avatar, Space, Typography } from "antd";
import { CHAINS } from "../../../../../../consts/chains";
import { MAINNET } from "../../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../../consts/tokens";
interface ITokenItem {
  chain: CHAINS;
  data: {
    token: string;
    liquidity: string;
  };
  // onClick: () => void;
}
const PairItem = ({ chain, data }: ITokenItem) => {
  let token = TOKEN_LIST[chain][MAINNET][data.token];
  
  return (
    <Space>
      <Avatar size={"small"} src={token.icon} />
      <Typography.Text>{data.liquidity} </Typography.Text>
      <Typography.Text strong>{token.symbol}</Typography.Text>
    </Space>
  );
};

export default PairItem;

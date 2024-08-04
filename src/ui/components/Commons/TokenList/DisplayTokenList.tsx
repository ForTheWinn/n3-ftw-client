import React from "react";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { Avatar, Space, List, Card, Typography } from "antd";
import { IToken } from "../../../../consts/tokens";

interface ITokenListProps {
  tokenList: any[];
  chain: CHAINS;
  network: INetworkType;
  onClick: (token: IToken) => void;
}

const DisplayTokenList = ({
  tokenList,
  chain,
  network,
  onClick,
}: ITokenListProps) => {
  return (
    <Card size="small">
      <List
        dataSource={tokenList.filter((token) => token.isWhitelisted)}
        renderItem={(token: IToken) => (
          <List.Item onClick={() => onClick(token)}>
            <Space>
              <Avatar size="small" src={token.icon} />
              <Typography.Text>{token.symbol}</Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DisplayTokenList;

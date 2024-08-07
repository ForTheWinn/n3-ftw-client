import React from "react";
import { Avatar, Button, Card, List, Space, Typography } from "antd";
import { CHAINS } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { getExplorer } from "../../../../../../../common/helpers";
import { FTW_LOGO_URL } from "../../../../../../../consts/global";
import { ISmithTokenProps } from "../../../../../../../common/routers/smith/interfaces";

interface ITokenCardProps extends ISmithTokenProps {
  chain: CHAINS;
  network: INetworkType;
  isContractOwner?: boolean;
  price?: number;
  onUpdate: () => void;
}
const TokenCard = ({
  isContractOwner,
  chain,
  network,
  name,
  symbol,
  tokenAddress,
  website,
  icon,
  price,
  totalSupply,
  onUpdate,
}: ITokenCardProps) => {
  let MC = 0;
  if (totalSupply && price) {
    MC = parseFloat(totalSupply as any) * price;
  }

  return (
    <List.Item>
      <Card
        style={{ overflow: "hidden", wordBreak: "break-all" }}
        actions={[
          <Space>
            <Button
              size="small"
              target="_blank"
              href={`${getExplorer(
                chain,
                network,
                "contract"
              )}/${tokenAddress}`}
              rel="noreferrer"
            >
              Info
            </Button>
            {website && (
              <Button
                size="small"
                target="_blank"
                href={website}
                rel="noreferrer"
              >
                Website
              </Button>
            )}
            {isContractOwner && (
              <Button type="primary" size="small" onClick={onUpdate}>
                Update
              </Button>
            )}
          </Space>,
        ]}
      >
        <Space size="middle" style={{ width: "100%" , minHeight:"80px" }}>
          <Avatar size={"large"} src={icon ? icon : FTW_LOGO_URL} />
          <Space direction="vertical">
            <Typography.Text strong>{symbol}</Typography.Text>
            <Typography.Text ellipsis>{name}</Typography.Text>
            {MC > 0 && (
              <Typography.Text>MC: ${MC.toLocaleString()}</Typography.Text>
            )}
          </Space>
        </Space>
      </Card>
    </List.Item>
  );
};

export default TokenCard;

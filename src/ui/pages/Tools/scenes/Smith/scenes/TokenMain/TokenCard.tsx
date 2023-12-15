import React from "react";
import { Avatar, Button, List, Space } from "antd";
import { CHAINS } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { getExplorer } from "../../../../../../../common/helpers";
import { FTW_LOGO_URL } from "../../../../../../../consts/global";
import { ISmithTokenProps } from "../../../../../../../common/routers/smith/interfaces";

interface ITokenCardProps extends ISmithTokenProps {
  chain: CHAINS;
  network: INetworkType;
  isContractOwner?: boolean;
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
  onUpdate,
}: ITokenCardProps) => {
  return (
    <List.Item
      actions={
        isContractOwner
          ? [
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
                View
              </Button>,
              <Button size="small" onClick={onUpdate} type="primary">
                Update
              </Button>,
            ]
          : [
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
                View
              </Button>,
            ]
      }
    >
      <List.Item.Meta
        avatar={<Avatar size={"large"} src={icon ? icon : FTW_LOGO_URL} />}
        title={
          <Space>
            <span>{symbol}</span>
            <span>({name})</span>
          </Space>
        }
        description={
          <div>
            <Space>
              <span>{website}</span>
            </Space>
            <br />
          </div>
        }
      />
    </List.Item>
  );
};

export default TokenCard;

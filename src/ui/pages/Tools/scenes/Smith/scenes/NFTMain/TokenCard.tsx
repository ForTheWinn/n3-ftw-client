import React from "react";
import { Avatar, List, Space } from "antd";
import { getExplolerForContract } from "../../../../../../../helpers";
import { CHAINS } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";

interface ITokenCardProps {
  chain: CHAINS;
  network: INetworkType;
  owner: string;
  contractHash: string;
  name: string;
  symbol: string;
  website?: string;
  icon?: string;
  isContractOwner?: boolean;
  onUpdate: () => void;
}
const TokenCard = ({
  isContractOwner,
  chain,
  network,
  name,
  symbol,
  contractHash,
  website,
  icon,
  onUpdate
}: ITokenCardProps) => {
  return (
    <List.Item
      actions={
        isContractOwner
          ? [
              <a onClick={onUpdate} key="list-edit">
                Edit
              </a>
            ]
          : []
      }
    >
      <List.Item.Meta
        avatar={<Avatar size={"large"} src={icon} />}
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
      <a
        target="_blank"
        href={`${getExplolerForContract(chain, network)}/${contractHash}`}
        rel="noreferrer"
      >
        View details
      </a>
    </List.Item>
  );
};

export default TokenCard;

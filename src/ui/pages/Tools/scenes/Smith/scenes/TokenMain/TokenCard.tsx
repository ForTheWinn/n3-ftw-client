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
    <List.Item
      actions={
        isContractOwner
          ? [
              <Button
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
              <Button onClick={onUpdate}>Update</Button>,
            ]
          : [
              <Button
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
          <>
            <div>{`${symbol} (${name})`}</div>
            <div>
              <span>{website}</span>
            </div>
            {MC > 0 ? (
              <div>
                <Space>
                  <span>MC: ${MC.toLocaleString()}</span>
                </Space>
              </div>
            ) : (
              <></>
            )}
          </>
        }
      />
    </List.Item>
  );
};

export default TokenCard;

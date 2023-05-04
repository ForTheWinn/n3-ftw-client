import React from "react";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { SWAP_TOKEN_LIST } from "../../../../consts/tokens";
import { Avatar, Space } from "antd";
import { ITokenState } from "../../../pages/Swap/scenes/Swap/interfaces";

interface ITokenListProps {
  keyword?: string;
  chain: CHAINS;
  network: INetworkType;
  onClick: (token: ITokenState) => void;
}
const DisplayTokenList = ({
  keyword,
  chain,
  network,
  onClick
}: ITokenListProps) => {
  console.log(keyword);
  let tokenList = SWAP_TOKEN_LIST[chain][network];
  if (keyword) {
    tokenList = tokenList.filter((item) =>
      item.symbol.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  return (
    <>
      {tokenList.map((token) => {
        return (
          <a
            key={token.hash}
            onClick={() => onClick(token)}
            className="panel-block is-clickable"
          >
            <Space>
              <Avatar size="small" src={token.icon} />
              {token.symbol}
            </Space>
          </a>
        );
      })}
    </>
  );
};

export default DisplayTokenList;

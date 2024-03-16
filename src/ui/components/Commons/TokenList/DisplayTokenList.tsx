import React from "react";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { TOKEN_LIST } from "../../../../consts/tokens";
import { Avatar, Space } from "antd";
import { IToken } from "../../../../consts/tokens";

interface ITokenListProps {
  keyword?: string;
  chain: CHAINS;
  network: INetworkType;
  onClick: (token: IToken) => void;
}
const DisplayTokenList = ({
  keyword,
  chain,
  network,
  onClick,
}: ITokenListProps) => {
  let tokenList: any = TOKEN_LIST[chain][network];
  if (keyword) {
    tokenList = tokenList.filter((item) =>
      item.symbol.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  return (
    <>
      {tokenList.map((token) => {
        if (!token.isWhitelisted) return null;
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

import React from "react";
import { INetworkType } from "../../packages/neo/network";
import { UNKNOWN_TOKEN_IMAGE } from "../../consts/global";
import { Avatar, Space } from "antd";
import { CHAINS } from "../../consts/chains";
import { getTokenByHash } from "../../common/helpers";

interface IPairIconsProps {
  network: INetworkType;
  tokenA: string;
  tokenB: string;
  chain: CHAINS;
}
const PairIcons = ({ network, tokenA, tokenB, chain }: IPairIconsProps) => {
  const tokenAObj = getTokenByHash(chain, network, tokenA);
  const tokenBObj = getTokenByHash(chain, network, tokenB);
  return (
    <Space>
      <Avatar
        size={"small"}
        src={tokenAObj && tokenAObj.icon ? tokenAObj.icon : UNKNOWN_TOKEN_IMAGE}
      />
      <Avatar
        size={"small"}
        src={tokenBObj && tokenBObj.icon ? tokenBObj.icon : UNKNOWN_TOKEN_IMAGE}
      />
    </Space>
  );
};

export default PairIcons;

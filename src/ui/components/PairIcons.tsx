import React from "react";
import { INetworkType } from "../../packages/neo/network";
import { UNKNOWN_TOKEN_IMAGE } from "../../consts/global";
import { CHAINS } from "../../consts";
import { TOKEN_LIST } from "../../consts/tokens";
import { Avatar, Space } from "antd";

interface IPairIconsProps {
  network: INetworkType;
  tokenA: string;
  tokenB: string;
  chain: CHAINS.CHAINS;
}
const PairIcons = ({ network, tokenA, tokenB, chain }: IPairIconsProps) => {
  let token1 = TOKEN_LIST[chain][network][tokenA]
    ? TOKEN_LIST[chain][network][tokenA]
    : undefined;

  let token2 = TOKEN_LIST[chain][network][tokenB]
    ? TOKEN_LIST[chain][network][tokenB]
    : undefined;

  return (
    <Space>
      <Avatar src={token1 && token1.icon ? token1.icon : UNKNOWN_TOKEN_IMAGE} />
      <Avatar src={token2 && token2.icon ? token2.icon : UNKNOWN_TOKEN_IMAGE} />
    </Space>
  );
};

export default PairIcons;

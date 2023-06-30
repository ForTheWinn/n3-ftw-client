import React from "react";
import { INetworkType } from "../../packages/neo/network";
import { UNKNOWN_TOKEN_IMAGE } from "../../consts/global";
import { TOKEN_LIST } from "../../consts/tokens";
import { Avatar, Space } from "antd";
import { CHAINS } from "../../consts/chains";

interface IPairIconsProps {
  network: INetworkType;
  tokenA: string;
  tokenB: string;
  chain: CHAINS;
}
const PairIcons = ({ network, tokenA, tokenB, chain }: IPairIconsProps) => {
  let token1 = TOKEN_LIST[chain][network][tokenA]
    ? TOKEN_LIST[chain][network][tokenA].icon
    : UNKNOWN_TOKEN_IMAGE;

  let token2 = TOKEN_LIST[chain][network][tokenB]
    ? TOKEN_LIST[chain][network][tokenB].icon
    : UNKNOWN_TOKEN_IMAGE;

  return (
    <Space>
      <Avatar size={"small"} src={token1} />
      <Avatar size={"small"} src={token2} />
    </Space>
  );
};

export default PairIcons;

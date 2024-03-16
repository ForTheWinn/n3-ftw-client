import React from "react";
import Swaps from "./Swaps";
import { CHAINS } from "../../../../../../consts/chains";
import CandleChart from "./CandleChart";
import { MAINNET } from "../../../../../../consts/global";
import { Avatar, Space, Typography } from "antd";
import { getTokenByHash } from "../../../../../../common/helpers";

interface ITokenDetailPageProps {
  chain: CHAINS;
  tokens: string[];
  tokenHash?: string;
}
const TokenDetailPage = (props: ITokenDetailPageProps) => {
  let token;
  if (props.tokenHash) {
    token = getTokenByHash(props.chain, MAINNET, props.tokenHash);
  }
  return (
    <div>
      <Typography.Paragraph>
        <Space>
          <Avatar size={"small"} src={token.icon} />
          <Typography.Text strong>{token.symbol}</Typography.Text>
        </Space>
      </Typography.Paragraph>

      {props.tokenHash && (
        <CandleChart chain={props.chain} tokenHash={props.tokenHash} />
      )}
      <Swaps {...props} />
    </div>
  );
};

export default TokenDetailPage;

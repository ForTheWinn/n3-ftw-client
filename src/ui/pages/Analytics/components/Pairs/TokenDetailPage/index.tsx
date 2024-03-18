import React from "react";
import Swaps from "./Swaps";
import { CHAINS } from "../../../../../../consts/chains";
import CandleChart from "./CandleChart";
import { MAINNET } from "../../../../../../consts/global";
import { Avatar, Button, Divider, Space, Typography } from "antd";
import { getTokenByHash } from "../../../../../../common/helpers";
import { Link } from "react-router-dom";
import { SWAP_PATH } from "../../../../../../consts/routes";

interface ITokenDetailPageProps {
  chain: CHAINS;
  tokens: string[];
}
const TokenDetailPage = (props: ITokenDetailPageProps) => {
  let token;
  if (props.tokens.length > 0) {
    token = getTokenByHash(props.chain, MAINNET, props.tokens[0]);
  }
  return (
    <div>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Space>
          <Avatar src={token.icon} />
          <Typography.Title level={3} className="is-marginless">
            {token.symbol}
          </Typography.Title>
        </Space>
        <Link to={`${SWAP_PATH}?tokenB=${token.hash}`}>
          <Button type="primary">Trade on FTWSwap</Button>
        </Link>
      </Space>

      <Divider />
      {token && (
        <>
          <CandleChart chain={props.chain} tokenHash={token.hash} /> <Divider />
        </>
      )}
      <Swaps {...props} />
    </div>
  );
};

export default TokenDetailPage;

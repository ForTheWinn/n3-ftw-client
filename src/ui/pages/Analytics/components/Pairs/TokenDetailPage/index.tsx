import React from "react";
import Swaps from "./Swaps";
import { CHAINS } from "../../../../../../consts/chains";
import CandleChart from "./CandleChart";
import { MAINNET } from "../../../../../../consts/global";
import { Avatar, Button, Divider, Space, Typography } from "antd";
import { getTokenByHash } from "../../../../../../common/helpers";
import { useHistory } from "react-router-dom";
import { SWAP_PATH } from "../../../../../../consts/routes";
import { useApp } from "../../../../../../common/hooks/use-app";
import { RestAPI } from "../../../../../../packages/neo/api";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import TokenStats from "./TokenStats";

interface ITokenDetailPageProps {
  chain: CHAINS;
  tokens: string[];
}
const TokenDetailPage = (props: ITokenDetailPageProps) => {
  const history = useHistory();
  const { chain, switchChain } = useApp();
  let token;
  if (props.tokens.length > 0) {
    token = getTokenByHash(props.chain, MAINNET, props.tokens[0]);
  }

  const handleTradeClick = () => {
    if (token) {
      if (chain !== props.chain) {
        switchChain(props.chain);
      }
      history.push(`${SWAP_PATH}?tokenB=${token.hash}`);
    }
  };

  const { data, isLoaded } = useOnChainData(() => {
    return new RestAPI(MAINNET).getToken(token.hash);
  }, []);

  return (
    <div>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Space>
          <Avatar src={token.icon} />
          <Typography.Title level={3} className="is-marginless">
            {token.symbol}
          </Typography.Title>
        </Space>
        <Button type="primary" onClick={handleTradeClick}>
          Trade on FTWSwap
        </Button>
      </Space>
      <Divider />
      <TokenStats ca={token.hash} />
      <Divider />
      {token && (
        <>
          <CandleChart chain={props.chain} tokenHash={token.hash} />
        </>
      )}
      <Swaps {...props} />
    </div>
  );
};

export default TokenDetailPage;

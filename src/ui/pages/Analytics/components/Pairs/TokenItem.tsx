import React from "react";
import {
  Avatar,
  Button,
  Collapse,
  List,
  Space,
  Typography,
} from "antd";
import { CHAINS } from "../../../../../consts/chains";
import { MAINNET } from "../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../consts/tokens";
import { toDecimal } from "../../../../../packages/neo/utils";
import PairItem from "./PairItem";
const { Panel } = Collapse;
interface ITokenItem {
  chain: CHAINS;
  data: {
    token: string;
    liquidity: string;
    pairs: {
      tokenA: string;
      tokenB: string;
      reserves: {
        amountA: string;
        amountB: string;
      };
    }[];
  };
  onClick: (val: string[]) => void;
}
const TokenItem = ({ chain, data, onClick }: ITokenItem) => {
  let token = TOKEN_LIST[chain][MAINNET][data.token];
  if (token === undefined) return null;
  return (
    <>
      <Collapse
        size="small"
        collapsible="icon"
        bordered={false}
        defaultActiveKey={[]}
        style={{ background: "white", width: "100%" }}
      >
        <Panel
          header={
            <Space
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Space size="large" style={{ width: "100%" }}>
                <Avatar size={"small"} src={token.icon} />
                <Space size="small">
                  <Typography.Text>
                    {toDecimal(data.liquidity, token.decimals).toLocaleString()}{" "}
                  </Typography.Text>
                  <Typography.Text strong>{token.symbol}</Typography.Text>
                </Space>
              </Space>

              <Button onClick={() => onClick([data.token])} size="small">
                View
              </Button>
            </Space>
          }
          key="1"
        >
          <List
            bordered={false}
            pagination={false}
            dataSource={data ? data.pairs : []}
            renderItem={(item: any, i) => (
              <List.Item>
                <PairItem
                  chain={chain}
                  key={"token" + i}
                  defaultToken={data.token}
                  data={item}
                  onClick={onClick}
                />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </>
  );
};

export default TokenItem;

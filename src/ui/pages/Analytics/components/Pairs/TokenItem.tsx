import React from "react";
import { Avatar, Button, Collapse, List, Space, Typography } from "antd";
import { CHAINS } from "../../../../../consts/chains";
import { MAINNET } from "../../../../../consts/global";
import { toDecimal } from "../../../../../packages/neo/utils";
import PairItem from "./PairItem";
import { getTokenByHash } from "../../../../../common/helpers";
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
  let token = getTokenByHash(chain, MAINNET, data.token);
  if (token === undefined) return null;
  return (
    <>
      <Collapse
        bordered={false}
        style={{ background: "white", width: "100%" }}
        items={[
          {
            key: "1",
            label: (
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
                      {toDecimal(
                        data.liquidity,
                        token.decimals
                      ).toLocaleString()}{" "}
                    </Typography.Text>
                    <Typography.Text strong>{token.symbol}</Typography.Text>
                  </Space>
                </Space>

                <Button onClick={() => onClick([data.token])} size="small">
                  View
                </Button>
              </Space>
            ),
            children: (
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
            ),
          },
        ]}
      />
    </>
  );
};

export default TokenItem;

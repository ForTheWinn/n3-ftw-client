import React from "react";
import { Avatar, Button, List, Modal, Space, Typography } from "antd";
import { CHAINS } from "../../../../../consts/chains";
import { MAINNET } from "../../../../../consts/global";
import PairItem from "./PairItem";
import { getTokenByHash } from "../../../../../common/helpers";
import { LineChartOutlined } from "@ant-design/icons";
interface ITokenItem {
  chain: CHAINS;
  data: {
    token: string;
    price: string;
    liquidityUSD: string;
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
  const [pairs, setPairs] = React.useState<any[] | undefined>(undefined);
  if (token === undefined) return null;
  return (
    <>
      <Space>
        <Avatar size={"small"} src={token.icon} />
        <Space size="small">
          <Typography.Text>${data.price}</Typography.Text>
          <Typography.Text>
            Liq: ${data.liquidityUSD}
            {/* ({data.liquidity}{" "}
            <strong>{token.symbol}</strong>) */}
          </Typography.Text>
        </Space>
      </Space>
      <Space>
        <Button
          onClick={() => onClick([data.token])}
          size="small"
          icon={<LineChartOutlined />}
        >
          View
        </Button>
        <Button onClick={() => setPairs(data.pairs)} size="small">
          Pairs
        </Button>
      </Space>

      <Modal
        open={pairs ? true : false}
        onCancel={() => setPairs(undefined)}
        footer={[
          <Button key="back" onClick={() => setPairs(undefined)}>
            Close
          </Button>,
        ]}
      >
        <List
          bordered={false}
          pagination={false}
          dataSource={pairs}
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
      </Modal>
    </>
  );
};

export default TokenItem;

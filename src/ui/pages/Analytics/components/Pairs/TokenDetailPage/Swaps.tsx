import React from "react";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../packages/neo/api";
import { MAINNET, NEO_CHAIN } from "../../../../../../consts/global";
import { CHAINS } from "../../../../../../consts/chains";
import { Table, Typography } from "antd";
import { toDecimal } from "../../../../../../packages/neo/utils";
import TruncatedAddress from "../../../../../components/TruncatedAddress";
import moment from "moment";
import { get } from "http";
import { getTokenByHash } from "../../../../../../common/helpers";

interface ISwapsProps {
  chain: CHAINS;
  tokens: string[];
}
const Swaps = ({ chain, tokens }: ISwapsProps) => {
  const { data, isLoaded, error } = useOnChainData(() => {
    if (chain === NEO_CHAIN) {
      return new RestAPI(MAINNET).getNEOSwaps({
        tokens: tokens.join(","),
      });
    } else {
      return new RestAPI(MAINNET).getEVMSwaps({
        chain,
        tokens: tokens.join(","),
      });
    }
  }, [chain]);

  return (
    <Table
      size="small"
      loading={!isLoaded}
      pagination={false}
      dataSource={data ? data : []}
      columns={[
        {
          title: "In",
          key: "out",
          render: (data, i) => {
            const token = getTokenByHash(chain, MAINNET, data.tokenIn);
            if (!token)
              return (
                <div>
                  <Typography.Text>{data.amountIn}</Typography.Text>
                  <Typography.Text strong> {data.tokenIn}</Typography.Text>
                </div>
              );
            return (
              <div>
                <Typography.Text>
                  {toDecimal(data.amountIn, token.decimals).toLocaleString()}
                </Typography.Text>
                <Typography.Text strong> {token.symbol}</Typography.Text>
              </div>
            );
          },
        },
        {
          title: "Out",
          key: "out",
          render: (data, i) => {
            const token = getTokenByHash(chain, MAINNET, data.tokenOut);
            if (!token)
              return (
                <div>
                  <Typography.Text>{data.amountOut}</Typography.Text>
                  <Typography.Text strong> {data.tokenOut}</Typography.Text>
                </div>
              );
            return (
              <div>
                <Typography.Text>
                  {toDecimal(data.amountOut, token.decimals).toLocaleString()}
                </Typography.Text>
                <Typography.Text strong> {token.symbol}</Typography.Text>
              </div>
            );
          },
        },
        {
          title: "From",
          key: "from",
          render: (data, i) => {
            return <TruncatedAddress address={data.account} />;
          },
        },
        {
          title: "",
          key: "Date",
          render: (data, i) => {
            return (
              <div>
                {data.createdAt
                  ? moment.unix(data.createdAt / 1000).format("llll")
                  : ""}
              </div>
            );
          },
        },
      ]}
    />
  );
};

export default Swaps;

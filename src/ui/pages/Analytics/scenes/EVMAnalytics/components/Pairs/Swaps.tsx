import React from "react";
import { useOnChainData } from "../../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../../packages/neo/api";
import { MAINNET } from "../../../../../../../consts/global";
import { CHAINS } from "../../../../../../../consts/chains";
import { Table, Typography } from "antd";
import { TOKEN_LIST } from "../../../../../../../consts/tokens";
import { toDecimal } from "../../../../../../../packages/neo/utils";

interface ISwapsProps {
  chain: CHAINS;
  tokens: string[];
}
const Swaps = ({ chain, tokens }: ISwapsProps) => {
  const { data, isLoaded, error } = useOnChainData(() => {
    return new RestAPI(MAINNET).getEVMSwaps({
      chain,
      tokens: tokens.join(","),
    });
  }, []);
  console.log(data);
  let tokenList = TOKEN_LIST[chain][MAINNET];

  return (
    <Table
      loading={!isLoaded}
      pagination={false}
      dataSource={data ? data : []}
      columns={[
        {
          title: "In",
          key: "out",
          render: (data, i) => {
            const token = tokenList[data.tokenIn];
            return (
              <div>
                <Typography.Text>
                  {toDecimal(data.amountIn, token.decimals)}
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
            const token = tokenList[data.tokenOut];
            return (
              <div>
                <Typography.Text>
                  {toDecimal(data.amountOut, token.decimals)}
                </Typography.Text>
                <Typography.Text strong> {token.symbol}</Typography.Text>
              </div>
            );
          },
        },
      ]}
    />
  );
};

export default Swaps;

import React from "react";
import { INetworkType } from "../../../../../../packages/neo/network";
import { decimalCuts, numberTrim } from "../../../../../../packages/neo/utils";
import { FaChartLine } from "react-icons/fa";
import { Avatar, Space } from "antd";
import { CHAINS } from "../../../../../../consts/chains";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../../../consts/global";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../packages/neo/api";
import { getTokenByHash } from "../../../../../../common/helpers";

interface ITokenItem {
  chain: CHAINS;
  id: string;
  network: INetworkType;
  symbol: string;
  onClick: (id: string) => void;
}
const TokenItem = ({ id, symbol, chain, network, onClick }: ITokenItem) => {
  const { data, isLoaded } = useOnChainData(() => {
    return new RestAPI(network).getToken(id);
  }, []);

  if (!isLoaded) return <></>;
  if (data && data.totalLiquidityUSD <= 0) return <></>;

  const token = getTokenByHash(chain, network, id);
  const logo = token && token.icon ? token.icon : UNKNOWN_TOKEN_IMAGE;

  return (
    <tr>
      <td>
        <Space>
          <Avatar size={"small"} src={process.env.PUBLIC_URL + logo} />
          <span className="is-accent">{symbol}</span>
        </Space>
      </td>
      <td>{data ? "$" + numberTrim(data.price, decimalCuts(symbol)) : ""}</td>
      <td
        className={
          data && data.change24H >= 0 ? "has-text-success" : "has-text-danger"
        }
      >
        {data
          ? data.change24H !== 0
            ? numberTrim(data.change24H, 2) + "%"
            : ""
          : ""}
      </td>
      <td
        className={
          data && data.change7Days >= 0 ? "has-text-success" : "has-text-danger"
        }
      >
        {data
          ? data.change7Days !== 0
            ? numberTrim(data.change7Days, 2) + "%"
            : ""
          : ""}
      </td>
      <td>
        {data
          ? "$" +
            parseFloat(numberTrim(data.tradeVolumeUSD, 0)).toLocaleString()
          : ""}
      </td>
      <td>
        {data
          ? "$" +
            parseFloat(numberTrim(data.totalLiquidityUSD, 0)).toLocaleString()
          : ""}
      </td>
      <td style={{ textAlign: "right" }}>
        <button
          onClick={() => onClick(id)}
          className="button is-small is-white"
        >
          <FaChartLine />
        </button>
      </td>
    </tr>
  );
};

export default TokenItem;

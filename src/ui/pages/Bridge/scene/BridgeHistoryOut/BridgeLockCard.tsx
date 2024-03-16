import React from "react";
import TruncatedAddress from "../../../../components/TruncatedAddress";
import { IBridgeBurn } from "../../../../../common/routers/bridge/interfaces";
import { INetworkType } from "../../../../../packages/neo/network";
import { NEO_CHAIN } from "../../../../../consts/global";
import { formatAmount, getTokenByHash } from "../../../../../common/helpers";
interface IBridgeBurnCardProps {
  data: IBridgeBurn;
  network: INetworkType;
}
const BridgeBurnCard = ({ data, network }: IBridgeBurnCardProps) => {
  const token = getTokenByHash(NEO_CHAIN, network, data.neoTokenAddress);
  return (
    <tr>
      <td>{data.no}</td>
      <td>{token?.symbol}</td>
      <td>{token ? formatAmount(data.amount, token.decimals) : ""}</td>
      <td>
        <TruncatedAddress address={data.evmSender} />
      </td>
      <td>
        <TruncatedAddress address={data.receiver} />
      </td>

      <td>{data.createdAt}</td>
    </tr>
  );
};

export default BridgeBurnCard;

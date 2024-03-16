import React from "react";
import TruncatedAddress from "../../../../components/TruncatedAddress";
import { IBridgeMint } from "../../../../../common/routers/bridge/interfaces";
import { INetworkType } from "../../../../../packages/neo/network";
import { NEO_CHAIN } from "../../../../../consts/global";
import { formatAmount, getTokenByHash } from "../../../../../common/helpers";
interface IBridgeMintCardProps {
  data: IBridgeMint;
  network: INetworkType;
}
const BridgeMintCard = ({ data, network }: IBridgeMintCardProps) => {
  const token = getTokenByHash(NEO_CHAIN, network, data.neoTokenAddress);
  return (
    <tr>
      <td>{data.no}</td>
      <td>{token?.symbol}</td>
      <td>{token ? formatAmount(data.amount, token.decimals) : ""}</td>
      <td>
        <TruncatedAddress address={data.sender} />
      </td>
      <td>
        <TruncatedAddress address={data.evmReceiver} />
      </td>
      <td>{data.createdAt}</td>
    </tr>
  );
};

export default BridgeMintCard;

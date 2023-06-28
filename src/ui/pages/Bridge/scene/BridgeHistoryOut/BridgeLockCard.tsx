import React from "react";
import { TOKEN_LIST } from "../../../../../consts/tokens";
import TruncatedAddress from "../../../../components/TruncatedAddress";
import { IBridgeBurn } from "../../../../../common/routers/bridge/interfaces";
import { ethers } from "ethers";
import { INetworkType } from "../../../../../packages/neo/network";
import { NEO_CHAIN } from "../../../../../consts/global";
interface IBridgeBurnCardProps {
  data: IBridgeBurn;
  network: INetworkType;
}
const BridgeBurnCard = ({ data, network }: IBridgeBurnCardProps) => {
  const token = TOKEN_LIST[NEO_CHAIN][network][data.neoTokenAddress];
  return (
    <tr>
      <td>{data.no}</td>
      <td>{token?.symbol}</td>
      <td>
        {token ? ethers.utils.formatUnits(data.amount, token.decimals) : ""}
      </td>
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

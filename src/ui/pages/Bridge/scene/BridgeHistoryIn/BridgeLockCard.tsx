import React from "react";
import { TOKEN_LIST } from "../../../../../consts/tokens";
import { NEO_CHAIN } from "../../../../../consts/chains";
import TruncatedAddress from "../../../../components/TruncatedAddress";
import { IBridgeMint } from "../../../../../common/routers/bridge/interfaces";
import { ethers } from "ethers";
import { INetworkType } from "../../../../../packages/neo/network";
interface IBridgeMintCardProps {
  data: IBridgeMint;
  network: INetworkType;
}
const BridgeMintCard = ({ data, network }: IBridgeMintCardProps) => {
  const token = TOKEN_LIST[NEO_CHAIN][network][data.neoTokenAddress];
  return (
    <tr>
      <td>{data.no}</td>
      <td>{token?.symbol}</td>
      <td>
        {token ? ethers.utils.formatUnits(data.amount, token.decimals) : ""}
      </td>
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

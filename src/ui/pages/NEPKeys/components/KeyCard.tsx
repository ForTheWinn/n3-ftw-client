import moment from "moment";
import React from "react";
import { useOnChainData } from "../../../../common/hooks/use-onchain-data";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import { LOCKER_SCRIPT_HASH } from "../../../../packages/neo/contracts/ftw/locker/consts";
import { INetworkType } from "../../../../packages/neo/network";
import { base64ToString, toDecimal } from "../../../../packages/neo/utils";
import CountdownRender from "../../Locker/components/CountdownRender";

interface IKeyCardProps {
  network: INetworkType;
  lockerId: string;
  price: string;
  onClick: () => void;
}
const KeyCard = ({ network, lockerId, price, onClick }: IKeyCardProps) => {
  const lockerNo = base64ToString(lockerId);
  const { data } = useOnChainData(
    () => new LockerContract(network).getLockerByNo(lockerNo),
    []
  );
  if (!data) return <></>;

  const releaseAt = moment.unix(data.releaseAt / 1000);

  return (
    <tr>
      <td>Locker no: {lockerNo}</td>
      <td>{toDecimal(price).toLocaleString()} NEP</td>
      <td>{toDecimal(parseFloat(price) * 0.02).toLocaleString()} NEP</td>
      <td>{toDecimal(data.amount).toLocaleString()} NEP</td>
      <td>{releaseAt.format("lll")}</td>
      <td>
        <CountdownRender timestamp={data.releaseAt} />
      </td>
      <td>
        <a
          target="_blank"
          href={`https://ghostmarket.io/asset/n3/${LOCKER_SCRIPT_HASH[network]}/${lockerId}`}
          className="button is-small is-info is-light"
          rel="noreferrer"
        >
          View on GM
        </a>
      </td>
      <td>
        <button
          onClick={onClick}
          className="button is-small is-primary is-light"
        >
          Buy
        </button>
      </td>
    </tr>
  );
};

export default KeyCard;

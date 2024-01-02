import React from "react";
import moment from "moment";
import { u } from "@cityofzion/neon-core";
import { FaLock, FaUnlock } from "react-icons/fa";
import {
  ILocker,
  ILockerContract,
} from "../../../../packages/neo/contracts/ftw/locker/interface";
import CountdownRender from "../components/CountdownRender";
import { toDecimal } from "../../../../packages/neo/utils";
interface ILockerCardProps {
  contract: ILockerContract;
  locker: ILocker;
}
const LockerCard = ({ locker, contract }: ILockerCardProps) => {
  const releaseAt = moment.unix(locker.releaseAt / 1000);
  const amount = toDecimal(locker.amount, contract.decimals);
  return (
    <tr key={locker.lockerNo}>
      <td>{locker.lockerNo}</td>
      <td>{`${amount.toLocaleString()} ${contract.symbol}`}</td>
      <td>{releaseAt.format("lll")}</td>
      <td>{locker.createdAt}</td>
      <td>
        <CountdownRender timestamp={locker.releaseAt} />
      </td>
      <td>{locker.releasedAt > 0 ? <FaUnlock /> : <FaLock />}</td>
    </tr>
  );
};

export default LockerCard;

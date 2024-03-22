import React, { useEffect, useState } from "react";
import moment from "moment";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import {
  ILocker,
  ILockerContract,
} from "../../../../packages/neo/contracts/ftw/locker/interface";
import { FaLock, FaUnlock } from "react-icons/fa";
import CountdownRender from "../components/CountdownRender";
import { useApp } from "../../../../common/hooks/use-app";
import { toDecimal } from "../../../../packages/neo/utils";

interface ILockerByUserCardProps extends ILocker {}

const LockerCard = (locker: ILockerByUserCardProps) => {
  const { chain, network } = useApp();
  const [data, setData] = useState<ILockerContract | undefined>();
  const releaseAt = moment.unix(locker.releaseAt / 1000);

  useEffect(() => {
    async function fetch() {
      try {
        const contract = await new LockerContract(network).getContract(
          locker.contractHash
        );
        setData(contract);
      } catch (e: any) {
        console.error(e);
      }
    }
    fetch();
  }, [network]);
  return (
    <tr key={locker.lockerNo}>
      <td>{locker.lockerNo}</td>
      <td>{locker.owner}</td>
      <td>{data ? data.symbol : ""}</td>
      <td>
        {data
          ? `${toDecimal(locker.amount, data.decimals)} ${data.symbol}`
          : ""}
      </td>
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

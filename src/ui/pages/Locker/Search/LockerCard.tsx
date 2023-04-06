import React, { useEffect, useState } from "react";
import moment from "moment";
import { u } from "@cityofzion/neon-core";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import {
  ILocker,
  ILockerContract
} from "../../../../packages/neo/contracts/ftw/locker/interface";
import { FaLock, FaUnlock } from "react-icons/fa";
import CountdownRender from "../components/CountdownRender";
import { useApp } from "../../../../common/hooks/use-app";

interface ILockerByUserCardProps extends ILocker {}

const LockerCard = (locker: ILockerByUserCardProps) => {
  const { network } = useApp();
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
      <td>{locker.contractHash}</td>
      <td>{data ? data.symbol : ""}</td>
      <td>
        {data
          ? `${parseFloat(
              u.BigInteger.fromNumber(locker.amount).toDecimal(data.decimals)
            ).toLocaleString()} ${data.symbol}`
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

import React, { useEffect, useState } from "react";
import moment from "moment";
import { u } from "@cityofzion/neon-core";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";
import {
  ILockerContract,
  ILockerKeyToken,
} from "../../../../packages/neo/contracts/ftw/locker/interface";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import { INetworkType } from "../../../../packages/neo/network";
import CountdownRender from "../components/CountdownRender";
import { toDecimal } from "../../../../packages/neo/utils";

interface ILockerByUserCardProps extends ILockerKeyToken {
  network: INetworkType;
  onUnLock: (lockerNo: number) => void;
}

const LockerKeyCard = (locker: ILockerByUserCardProps) => {
  const { connectedWallet } = useNeoWallets();
  const [data, setData] = useState<ILockerContract | undefined>();
  const releaseAt = moment.unix(locker.releaseAt / 1000);
  const now = moment().valueOf();
  const releaseAtValueOf = releaseAt.valueOf();
  const isActive = now > releaseAtValueOf && connectedWallet;

  useEffect(() => {
    async function fetch() {
      try {
        const contract = await new LockerContract(locker.network).getContract(
          locker.contractHash
        );
        setData(contract);
      } catch (e: any) {
        console.error(e);
      }
    }
    fetch();
  }, []);
  return (
    <tr key={locker.lockerNo}>
      <td>{locker.lockerNo}</td>
      <td>{locker.contractHash}</td>
      <td>{data ? data.symbol : ""}</td>
      <td>
        {data
          ? `${toDecimal(locker.amount, data.decimals)} ${data.symbol}`
          : ""}
      </td>
      <td>{releaseAt.format("lll")}</td>
      <td>
        <CountdownRender timestamp={locker.releaseAt} />
      </td>
      <td>
        <button
          onClick={() => locker.onUnLock(locker.lockerNo)}
          disabled={!isActive}
          className="button is-primary is-small is-outlined"
        >
          Unlock
        </button>
      </td>
    </tr>
  );
};

export default LockerKeyCard;

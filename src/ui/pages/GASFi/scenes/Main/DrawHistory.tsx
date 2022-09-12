import React, { useEffect, useState } from "react";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { IMainData } from "./index";
import { INetworkType } from "../../../../../packages/neo/network";
import {
  IDraw,
  IDrawsResult,
} from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";

export interface IDrawHistoryProps {
  network: INetworkType;
}
const DrawHistory = ({ network }: IDrawHistoryProps) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IDrawsResult | undefined>(undefined);
  const [error, setError] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new GasFiContract(network).getDraws(page);
				console.log(res)
        setData(res);
        setLoading(false);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [network]);
  return (
    <div>
      <h6 className="title is-6">History</h6>
    </div>
  );
};

export default DrawHistory;

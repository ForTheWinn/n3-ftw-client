import React, { useEffect, useState } from "react";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import Pagination from "bulma-pagination-react";
import { INetworkType } from "../../../../../packages/neo/network";
import {
  IDraw,
  IDrawsResult,
} from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import { withDecimal } from "../../../../../packages/neo/utils";
import moment from "moment";

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
        console.log(res);
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
  console.log(data);
  return (
    <div>
      <h6 className="title is-6">History</h6>

      <div className="table-container">
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>In</th>
              <th>Out</th>
              <th>Address</th>
              <th>At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>Loading..</td>
              </tr>
            ) : error ? (
              <div>{error}</div>
            ) : data ? (
              data.items.length > 0 ? (
                data.items.map((item, i) => {
                  return (
                    <tr key={`single-swap-${i}`}>
                      <td>
                        <>
                          {withDecimal(item.totalReward, 8, true)}
                          &nbsp;
                          <strong>bNEO</strong>
                        </>
                        )
                      </td>
                      <td>{moment(item.createdAt).format("lll")}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>No swap history</td>
                </tr>
              )
            ) : (
              <tr>
                <td>Something went wrong</td>
              </tr>
            )}
          </tbody>
          {data && data.totalPages > 1 && (
            <tfoot>
              <tr>
                <td colSpan={6}>
                  <Pagination
                    pages={data.totalPages}
                    currentPage={page}
                    onChange={(_page) => {
                      if (page !== _page) {
                        setPage(_page);
                      }
                    }}
                  />
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default DrawHistory;

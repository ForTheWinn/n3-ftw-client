import React, { useEffect, useState } from "react";
import { INetworkType } from "../../../../../../packages/neo/network";
import { RestAPI } from "../../../../../../packages/neo/api";
import { withDecimal } from "../../../../../../packages/neo/utils";
import TruncatedAddress from "../../../../../components/TruncatedAddress";
import Pagination from "bulma-pagination-react";
import moment from "moment";
import { WENT_WRONG } from "../../../../../../consts/messages";

interface ISwapHistoryProps {
  tokenA: string;
  tokenB: string;
  network: INetworkType;
  pairs: {
    [key: string]: {
      symbol: string;
      decimals: number;
      price?: number;
    };
  };
}
const SwapHistory = ({ network, tokenA, tokenB, pairs }: ISwapHistoryProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetch() {
      setError("");
      setLoading(true);
      try {
        const res = await new RestAPI(network).getSwapHistory(
          tokenA,
          tokenB,
          page
        );
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [network, page]);
  return (
    <div>
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
                data.items.map((swap, i) => {
                  return (
                    <tr key={`swap-${i}`}>
                      <td>
                        {withDecimal(
                          swap.base_amount,
                          pairs[swap.base_id].decimals,
                          true
                        )}
                        &nbsp;
                        <strong>{pairs[swap.base_id].symbol}</strong>
                      </td>
                      <td>
                        {withDecimal(
                          swap.quote_amount,
                          pairs[swap.quote_id].decimals,
                          true
                        )}
                        &nbsp;
                        <strong>{pairs[swap.quote_id].symbol}</strong>
                      </td>
                      <td>
                        <TruncatedAddress address={swap.account} />
                      </td>
                      <td>{moment(swap.time).format("lll")}</td>
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
                <td>{WENT_WRONG}</td>
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

export default SwapHistory;

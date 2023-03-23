import React, { useEffect, useState } from "react";
import { INetworkType } from "../../../../../../packages/neo/network";
import { RestAPI } from "../../../../../../packages/neo/api";
import { withDecimal } from "../../../../../../packages/neo/utils";
import TruncatedAddress from "../../../../../components/TruncatedAddress";
import Pagination from "bulma-pagination-react";
import moment from "moment";
import { MAINNET_TOKEN_LIST } from "../../../../../../packages/neo/consts/mainnet-token-list";

interface ISwapHistoryProps {
  id: string;
  network: INetworkType;
}
const SwapHistory = ({ network, id }: ISwapHistoryProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetch() {
      setError("");
      setLoading(true);
      try {
        const res = await new RestAPI(network).getSingleSwapHistory(id, page);
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
                  const tokenIn = MAINNET_TOKEN_LIST[swap.base_id.substring(2)];
                  const tokenOut =
                    MAINNET_TOKEN_LIST[swap.quote_id.substring(2)];
                  return (
                    <tr key={`single-swap-${i}`}>
                      <td>
                        {tokenIn ? (
                          <>
                            {withDecimal(
                              swap.base_amount,
                              tokenIn.decimals,
                              true
                            )}
                            &nbsp;
                            <strong>{tokenIn.symbol}</strong>
                          </>
                        ) : (
                          <>{swap.base_amount}</>
                        )}
                      </td>
                      <td>
                        {tokenOut ? (
                          <>
                            {" "}
                            {withDecimal(
                              swap.quote_amount,
                              tokenOut.decimals,
                              true
                            )}
                            &nbsp;
                            <strong>{tokenOut.symbol}</strong>
                          </>
                        ) : (
                          <>{swap.quote_amount}</>
                        )}
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

export default SwapHistory;

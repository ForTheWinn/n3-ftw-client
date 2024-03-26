import React, { useState } from "react";
import { INetworkType } from "../../../../../../packages/neo/network";
import { withDecimal } from "../../../../../../packages/neo/utils";
import TruncatedAddress from "../../../../../components/TruncatedAddress";
import moment from "moment";
import { Pagination } from "antd";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../packages/neo/api";

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

  const { data } = useOnChainData(() => {
    return new RestAPI(network).getSwapHistory(tokenA, tokenB, page);
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
            {data && data.items.length > 0 ? (
              data.items.map((swap, i) => {
                return (
                  <tr key={`swap-${i}`}>
                    <td>
                      {withDecimal(
                        swap.base_amount,
                        pairs[swap.base_id].decimals,
                        true
                      )}
                      <span className="is-accent">
                        {pairs[swap.base_id].symbol}
                      </span>
                    </td>
                    <td>
                      {withDecimal(
                        swap.quote_amount,
                        pairs[swap.quote_id].decimals,
                        true
                      )}
                      &nbsp;
                      <span className="is-accent">
                        {pairs[swap.quote_id].symbol}
                      </span>
                    </td>
                    <td>
                      <TruncatedAddress address={swap.account} />
                    </td>
                    <td>{moment(swap.time).format("lll")}</td>
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </table>

        {data && data.totalPages > 1 && (
          <Pagination
            current={page}
            pageSize={data.perPage}
            total={data.totalItems}
            showSizeChanger={false}
            onChange={(_page) => {
              if (page !== _page) {
                setPage(_page);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SwapHistory;

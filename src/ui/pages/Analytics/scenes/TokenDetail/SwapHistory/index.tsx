import React, { useState } from "react";
import { INetworkType } from "../../../../../../packages/neo/network";
import { RestAPI } from "../../../../../../packages/neo/api";
import { withDecimal } from "../../../../../../packages/neo/utils";
import TruncatedAddress from "../../../../../components/TruncatedAddress";
import { Pagination } from "antd";
import moment from "moment";
import { MAINNET_TOKEN_LIST } from "../../../../../../packages/neo/consts/mainnet-token-list";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";

interface ISwapHistoryProps {
  id: string;
  network: INetworkType;
}
const SwapHistory = ({ network, id }: ISwapHistoryProps) => {
  const [page, setPage] = useState(1);

  const { data } = useOnChainData(() => {
    return new RestAPI(network).getSingleSwapHistory(id, page);
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
            {data ? (
              data.items.length > 0 ? (
                data.items.map((swap, i) => {
                  const tokenIn = MAINNET_TOKEN_LIST[swap.base_id];
                  const tokenOut = MAINNET_TOKEN_LIST[swap.quote_id];
                  return (
                    <tr key={`single-swap-${i}`}>
                      <td>
                        {tokenIn ? (
                          <div>
                            <span>
                              {withDecimal(
                                swap.base_amount,
                                tokenIn.decimals,
                                true
                              )}
                            </span>

                            <span className="heading">{tokenIn.symbol}</span>
                          </div>
                        ) : (
                          <>{swap.base_amount}</>
                        )}
                      </td>
                      <td>
                        {tokenOut ? (
                          <>
                            {withDecimal(
                              swap.quote_amount,
                              tokenOut.decimals,
                              true
                            )}
                            <span className="heading">{tokenOut.symbol}</span>
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

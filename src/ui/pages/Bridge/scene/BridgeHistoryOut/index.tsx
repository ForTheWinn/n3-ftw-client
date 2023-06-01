import React, { useEffect, useState } from "react";
import Pagination from "bulma-pagination-react";
import BridgeLockCard from "./BridgeLockCard";
import { IBridgeBurnPagenate } from "../../../../../common/routers/bridge/interfaces";
import { getBurns } from "../../../../../packages/neo/contracts/ftw/bridge";
import { INetworkType } from "../../../../../packages/neo/network";

interface IBridgeHistoryOutProps {
  network: INetworkType;
  contractHash: string;
}
const BridgeHistoryOut = ({
  network,
  contractHash
}: IBridgeHistoryOutProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<IBridgeBurnPagenate>();

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getBurns(contractHash, network, page);
        setData(res);
      } catch (e: any) {
        console.error(e);
      }
    }
    fetch();
  }, [network, page]);
  return (
    <div className="table-container">
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Lock no</th>
            <th>Token</th>
            <th>Amount</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            <>
              {data.items.map((item) => (
                <BridgeLockCard key={item.no} data={item} network={network} />
              ))}
            </>
          ) : (
            <></>
          )}
        </tbody>
        {data && data.totalPages > 1 ? (
          <tfoot>
            <tr>
              <td colSpan={6}>
                <Pagination
                  pages={data.totalPages}
                  currentPage={page}
                  onChange={(v) => {
                    if (page !== v) {
                      setPage(v);
                    }
                  }}
                />
              </td>
            </tr>
          </tfoot>
        ) : (
          <></>
        )}
      </table>
    </div>
  );
};

export default BridgeHistoryOut;

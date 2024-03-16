import React, { useEffect, useState } from "react";
import BridgeLockCard from "./BridgeLockCard";
import { IBridgeMintPagenate } from "../../../../../common/routers/bridge/interfaces";
import { getMints } from "../../../../../packages/neo/contracts/ftw/bridge";
import { INetworkType } from "../../../../../packages/neo/network";
import { Pagination } from "antd";

interface IBridgeHistoryInProps {
  network: INetworkType;
  contractHash: string;
}
const BridgeHistoryIn = ({ contractHash, network }: IBridgeHistoryInProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<IBridgeMintPagenate>();

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getMints(contractHash, network, page);
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
                  total={data.totalPages}
                  current={page}
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

export default BridgeHistoryIn;

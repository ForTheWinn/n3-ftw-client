import React, { useEffect, useState } from "react";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import Pagination from "bulma-pagination-react";
import { INetworkType } from "../../../../../packages/neo/network";
import { IDrawsResult } from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import { withDecimal } from "../../../../../packages/neo/utils";
import moment from "moment";
import { IMainData } from "../Main";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import { WENT_WRONG } from "../../../../../consts/messages";

export interface IDrawHistoryProps {
  network: INetworkType;
  data?: IMainData;
  connectedWallet?: IConnectedWallet;
}
const DrawHistory = ({ network, data, connectedWallet }: IDrawHistoryProps) => {
  const [isLoading, setLoading] = useState(true);
  const [drawHistory, setDrawHistory] = useState<IDrawsResult | undefined>(
    undefined
  );
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [txid, setTxid] = useState("");

  const handleSuccess = () => {
    setTxid("");
  };

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new GasFiContract(network).getDraws(page);
        setDrawHistory(res);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [network]);

  return (
    <div>
      <div className="table-container">
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Draw #</th>
              <th>Winning position</th>
              <th>Total GAS</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>Loading..</td>
              </tr>
            ) : error ? (
              <div>{error}</div>
            ) : drawHistory ? (
              drawHistory.items.length > 0 ? (
                drawHistory.items.map((item, i) => {
                  return (
                    <tr key={`single-swap-${i}`}>
                      <td>{item.drawNo}</td>
                      <td>{item.position}</td>
                      <td>
                        <>{`${withDecimal(item.totalReward, 8, true)} GAS`}</>
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
                <td>{WENT_WRONG}</td>
              </tr>
            )}
          </tbody>
          {drawHistory && drawHistory.totalPages > 1 && (
            <tfoot>
              <tr>
                <td colSpan={6}>
                  <Pagination
                    pages={drawHistory.totalPages}
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

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={handleSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default DrawHistory;

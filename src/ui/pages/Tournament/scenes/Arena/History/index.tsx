import React, { useEffect, useState } from "react";
import Pagination from "bulma-pagination-react";
import { useNeoWallets } from "../../../../../../common/hooks/use-neo-wallets";
import { TournamentContract } from "../../../../../../packages/neo/contracts/ftw/arena";
import NFTDetailModal from "./NFTDetailModal";
import HistoryTable from "./HistoryTable";
import Replay from "./Replay";
import AfterTransactionSubmitted from "../../../../../components/NeoComponents/AfterTransactionSubmitted";
import Modal from "../../../../../components/Modal";
import { useApp } from "../../../../../../common/hooks/use-app";

interface IHistoryProps {
  arenaNo: string;
}
const History = ({ arenaNo }: IHistoryProps) => {
  const [claimTxid, setClaimTxid] = useState("");
  const [page, setPage] = useState(1);
  const [nftModalActive, setNftModalActive] = useState();
  const [replayModalActive, setReplayModalActive] = useState();
  const [history, setHistory] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const onNFTModalActive = (obj) => setNftModalActive(obj);
  const onReplayModalActive = (obj) => setReplayModalActive(obj);

  useEffect(() => {
    async function fetchHistory() {
      setError("");
      setLoading(true);
      try {
        const res = await new TournamentContract(network).history(
          arenaNo,
          page
        );
        setHistory(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [connectedWallet, network, page]);

  let totalPages = 0;
  if (history) {
    const itemsPerPage = parseFloat(arenaNo) >= 64 ? 2 : 5;
    totalPages = Math.ceil(history.totalItems / itemsPerPage);
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading..</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <div className="">
            {history.items && history.items.length > 0 ? (
              history.items.map((game) => {
                return (
                  <HistoryTable
                    key={game.gameNo}
                    width={"64px"}
                    height={"64px"}
                    history={game}
                    arenaNo={arenaNo}
                    network={network}
                    onClick={(obj) => {
                      onNFTModalActive(obj);
                    }}
                    onReplay={() => onReplayModalActive(game)}
                    onClaimed={setClaimTxid}
                  />
                );
              })
            ) : (
              <div>Game hasn't been played</div>
            )}
            {totalPages > 1 && (
              <div className="media">
                <div className="media-content">
                  <Pagination
                    pages={totalPages}
                    currentPage={page}
                    onChange={(_page) => {
                      if (page !== _page) {
                        setPage(_page);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {nftModalActive && (
        <NFTDetailModal
          rune={nftModalActive}
          onClose={() => setNftModalActive(undefined)}
        />
      )}

      {replayModalActive && (
        <Replay
          arenaNo={arenaNo}
          gameHistory={replayModalActive}
          onClick={(obj) => {
            onNFTModalActive(obj);
          }}
          onClose={() => setReplayModalActive(undefined)}
        />
      )}

      {claimTxid && (
        <Modal onClose={() => setClaimTxid("")}>
          <AfterTransactionSubmitted
            txid={claimTxid}
            network={network}
            onSuccess={() => setClaimTxid("")}
            onError={() => setClaimTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default History;

import React, { useEffect, useState } from "react";
import { IRuneMeta } from "../../../../../../../packages/neo/contracts/ftw/rune/interfaces";
import Modal from "../../../../../../components/Modal";
import { useWallet } from "../../../../../../../packages/neo/provider";
import BetButton from "../../../../components/BetButton";
import LeaveButton from "../../../../components/LeaveButton";
import AfterTransactionSubmitted from "../../../../../../components/NeoComponents/AfterTransactionSubmitted";
import { TournamentContract } from "../../../../../../../packages/neo/contracts/ftw/arena";
import { toDecimal } from "../../../../../../../packages/neo/utils";
import AdminLeaveButton from "../../../../components/AdminLeaveButton";

interface IPlayerModalProps {
  arenaNo: string;
  gameNo?: number;
  player: IRuneMeta & { tokenId: string; gameOwner: string };
  onClose: () => void;
}

const PlayerModal = ({
  arenaNo,
  gameNo,
  player,
  onClose
}: IPlayerModalProps) => {
  const [txid, setTxid] = useState("");
  const { connectedWallet, network } = useWallet();
  const [status, setStatus] = useState({
    totalBets: "",
    userBets: ""
  });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchContractStatus(_gameNo) {
      setError("");
      setLoading(true);
      try {
        const res = await new TournamentContract(network).getBetOnPlayer(
          arenaNo,
          _gameNo,
          player.tokenId,
          connectedWallet ? connectedWallet.account.address : undefined
        );
        setStatus(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (gameNo) {
      fetchContractStatus(gameNo);
    }
  }, [gameNo, network]);
  return (
    <Modal onClose={onClose}>
      <div>
        {txid ? (
          <AfterTransactionSubmitted
            onSuccess={onClose}
            onError={() => setTxid("")}
            txid={txid}
            network={network}
          />
        ) : (
          <div>
            <div className="columns">
              <div className="column">
                <img src={player.image} />
              </div>
              <div className="column">
                <div className="content">
                  <strong>Name</strong>
                  <br />
                  <p>{player.name}</p>
                  <strong>Phase</strong>
                  <p>{player.phase}</p>
                  <strong>Luck</strong>
                  <p>{player.luck}</p>
                  <strong>Owner</strong>
                  <p>{player.gameOwner}</p>
                  <strong>Current support amount</strong>
                  <p>{toDecimal(status.totalBets)}</p>
                  {connectedWallet && (
                    <>
                      <strong>My support amount</strong>
                      <p>{toDecimal(status.userBets)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <BetButton
                  setTxid={setTxid}
                  arenaNo={arenaNo}
                  tokenId={player.tokenId}
                />
              </div>
              <div className="column">
                <button
                  onClick={onClose}
                  className="button is-light is-fullwidth"
                >
                  Close
                </button>
              </div>
              {connectedWallet &&
              connectedWallet.account.address === player.gameOwner ? (
                <div className="column">
                  <LeaveButton
                    setTxid={setTxid}
                    arenaNo={arenaNo}
                    tokenId={player.tokenId}
                  />
                </div>
              ) : (
                <></>
              )}
              {process.env.NODE_ENV === "development" ? (
                <div className="column">
                  <AdminLeaveButton
                    setTxid={setTxid}
                    arenaNo={arenaNo}
                    tokenId={player.tokenId}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PlayerModal;

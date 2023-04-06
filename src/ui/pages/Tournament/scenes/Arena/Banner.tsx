import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import PlayButton from "../../components/PlayButton";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import { ADMIN_FOR_PLAY } from "../../../../../packages/neo/contracts/ftw/arena/consts";
import { NEO_ROUTES } from "../../../../../consts";
import { useApp } from "../../../../../common/hooks/use-app";

interface IBanner {
  arenaNo: string;
  pathname: string;
  status?: {
    prize: number;
    gameNo: number;
    previousChampWallet?: string;
    timeElapsedFromPreviousGame?: string;
  };
}
const Banner = ({ arenaNo, status, pathname }: IBanner) => {
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [playTxid, setPlayTxid] = useState("");

  let hasPermissionToPlay = false;
  if (ADMIN_FOR_PLAY[network].includes(connectedWallet?.account.address)) {
    hasPermissionToPlay = true;
  }
  if (
    connectedWallet &&
    status &&
    connectedWallet.account.address === status.previousChampWallet
  ) {
    hasPermissionToPlay = true;
  }
  return (
    <>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title is-4">ARENA {arenaNo}</h1>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            Round: #{status ? status.gameNo : ""}
            <br />
            Prize: {status ? status.prize + " GAS" : ""}
            {hasPermissionToPlay && (
              <div className="has-text-centered">
                <PlayButton
                  onSubmitted={setPlayTxid}
                  arenaNo={arenaNo}
                  status={status}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="tabs is-boxed">
        <ul>
          <li
            className={
              pathname === NEO_ROUTES.TOURNAMENT_PATH + "/" + arenaNo
                ? "is-active"
                : ""
            }
          >
            <Link to={NEO_ROUTES.TOURNAMENT_PATH + "/" + arenaNo}>Players</Link>
          </li>
          <li
            className={
              pathname ===
              NEO_ROUTES.TOURNAMENT_PATH + "/" + arenaNo + "/history"
                ? "is-active"
                : ""
            }
          >
            <Link to={NEO_ROUTES.TOURNAMENT_PATH + "/" + arenaNo + "/history"}>
              History
            </Link>
          </li>
        </ul>
      </div>

      {playTxid && (
        <Modal onClose={() => setPlayTxid("")}>
          <AfterTransactionSubmitted
            txid={playTxid}
            network={network}
            onSuccess={() => setPlayTxid("")}
            onError={() => setPlayTxid("")}
          />
        </Modal>
      )}
    </>
  );
};

export default Banner;

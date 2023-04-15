import React, { useEffect, useState } from "react";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";
import { TournamentContract } from "../../../../packages/neo/contracts/ftw/arena";
import toast from "react-hot-toast";
import { IHistoryGame } from "../../../../packages/neo/contracts/ftw/arena/interfaces";
import { calculateClaimableAmount } from "../../../../packages/neo/contracts/ftw/arena/helpers";
import { handleError } from "../../../../packages/neo/utils/errors";
import { useApp } from "../../../../common/hooks/use-app";

interface IClaimButtonProps {
  arenaNo: string;
  history: IHistoryGame;
  onClaimed: (txid: string) => void;
}
const ClaimButton = ({ arenaNo, history, onClaimed }: IClaimButtonProps) => {
  const [status, setStatus] = useState<any>({
    betAmount: 0,
    isClaimed: false
  });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const onClaim = async () => {
    if (connectedWallet) {
      try {
        const res = await new TournamentContract(network).claim(
          connectedWallet,
          arenaNo,
          history.gameNo
        );
        onClaimed(res);
      } catch (e: any) {
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };
  useEffect(() => {
    async function fetchBetAmount(address: string) {
      setError("");
      setLoading(true);
      try {
        const res = await new TournamentContract(network).getBetAmount(
          arenaNo,
          history.gameNo,
          history.champion,
          address
        );
        setStatus(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (connectedWallet) {
      fetchBetAmount(connectedWallet.account.address);
    }
  }, [connectedWallet, network, history]);
  if (!connectedWallet) return <></>;
  if (history.betsOnChampion === "0") return <></>;
  if (!status.betAmount) return <></>;
  return (
    <>
      {isLoading ? (
        <div>Loading..</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {status.isClaimed ? (
            <button disabled={true} className="button is-info is-fullwidth">
              Claimed
            </button>
          ) : (
            <button className="button is-info is-fullwidth" onClick={onClaim}>
              Claim {calculateClaimableAmount(history, status.betAmount)} GAS
            </button>
          )}
        </>
      )}
    </>
  );
};

export default ClaimButton;

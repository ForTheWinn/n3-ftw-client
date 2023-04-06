import React from "react";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";
import { TournamentContract } from "../../../../packages/neo/contracts/ftw/arena";
import toast from "react-hot-toast";
import { handleError } from "../../../../packages/neo/utils/errors";
import { useApp } from "../../../../common/hooks/use-app";

interface ILeaveButtonProps {
  arenaNo: string;
  tokenId: string;
  setTxid: (txid: string) => void;
}
const LeaveButton = ({ arenaNo, tokenId, setTxid }: ILeaveButtonProps) => {
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const onLeave = async () => {
    if (connectedWallet) {
      try {
        const res = await new TournamentContract(network).leave(
          connectedWallet,
          tokenId,
          arenaNo
        );
        setTxid(res);
      } catch (e: any) {
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };

  return (
    <button onClick={onLeave} className="button is-danger is-fullwidth">
      Leave
    </button>
  );
};

export default LeaveButton;

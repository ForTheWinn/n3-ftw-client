import React from "react";
import { useWallet } from "../../../../packages/neo/provider";
import { TournamentContract } from "../../../../packages/neo/contracts/ftw/arena";
import toast from "react-hot-toast";
import { handleError } from "../../../../packages/neo/utils/errors";

interface ILeaveButtonProps {
  arenaNo: string;
  tokenId: string;
  setTxid: (txid: string) => void;
}
const LeaveButton = ({ arenaNo, tokenId, setTxid }: ILeaveButtonProps) => {
  const { connectedWallet, network, addPendingTransaction } = useWallet();
  const onLeave = async () => {
    if (connectedWallet) {
      try {
        const res = await new TournamentContract(network).remove(
          connectedWallet,
          tokenId,
          arenaNo
        );
        addPendingTransaction(res);
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
      Admin Kick
    </button>
  );
};

export default LeaveButton;

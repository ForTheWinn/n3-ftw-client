import React from "react";
import { TournamentContract } from "../../../../packages/neo/contracts/ftw/arena";
import toast from "react-hot-toast";
import { useWallet } from "../../../../packages/neo/provider";
import { balanceCheck } from "../../../../packages/neo/utils";
import { SUPPORT_TICKET_PRICE } from "../../../../packages/neo/contracts/ftw/arena/consts";
import { handleError } from "../../../../packages/neo/utils/errors";

interface IBetButtonProps {
  arenaNo: string;
  tokenId: string;
  setTxid: (txid: string) => void;
}
const BetButton = ({ arenaNo, tokenId, setTxid }: IBetButtonProps) => {
  const { connectedWallet, network, addPendingTransaction } = useWallet();
  const onBet = async () => {
    if (connectedWallet) {
      try {
        const res = await new TournamentContract(network).bet(
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
    <button onClick={onBet} className="button is-primary is-fullwidth">
      Support {SUPPORT_TICKET_PRICE} GAS
    </button>
  );
};

export default BetButton;

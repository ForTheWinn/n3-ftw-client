import React, { useState } from "react";
import NFTListModal from "./NFTListModal";
import { useWallet } from "../../../../../../../packages/neo/provider";
import { toast } from "react-hot-toast";

interface IRegisterButtonProps {
  arenaNo: string;
  playerCount: number;
}
const RegisterButton = ({ arenaNo, playerCount }: IRegisterButtonProps) => {
  const [modalActive, setModalActive] = useState(false);
  const { connectedWallet } = useWallet();
  const onPickModal = () => {
    if (connectedWallet) {
      setModalActive(true);
    } else {
      toast.error("Connect your wallet.");
    }
  };
  return (
    <>
      <button
        disabled={playerCount === parseFloat(arenaNo)}
        className="button is-primary is-fullwidth"
        onClick={onPickModal}
      >
        Register ({playerCount}/{arenaNo})
      </button>
      {modalActive && connectedWallet && (
        <NFTListModal arenaNo={arenaNo} onClose={() => setModalActive(false)} />
      )}
    </>
  );
};

export default RegisterButton;

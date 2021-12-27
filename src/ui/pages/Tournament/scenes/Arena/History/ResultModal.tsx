import React from "react";
import { IRuneMeta } from "../../../../../../packages/neo/contracts/ftw/nft/interfaces";
import Modal from "../../../../../components/Modal";

interface IPlayerModalProps {
  rune: IRuneMeta;
  onClose: () => void;
}
const PlayerModal = ({ rune, onClose }: IPlayerModalProps) => {
  return (
    <Modal onClose={onClose}>
      <div className="columns">
        <div className="column">
          <img src={rune.image} />
        </div>
        <div className="column">
          <div className="content">
            <strong>Name</strong>
            <br />
            <p>{rune.name}</p>
            <strong>Phase</strong>
            <p>{rune.phase}</p>
            <strong>Luck</strong>
            <p>{rune.luck}</p>
          </div>
          <button className="button is-primary">Bet 1 GAS</button>
        </div>
      </div>
    </Modal>
  );
};

export default PlayerModal;

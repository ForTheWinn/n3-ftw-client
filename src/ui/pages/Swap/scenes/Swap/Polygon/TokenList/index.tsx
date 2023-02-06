import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

import ContractSearchInput from "./ContractSearchInput";
import SwapTokenCard from "../../../../components/TokenCard";
import Modal from "../../../../../../components/Modal";

import { POLYGON_TOKENS } from "../../../../../../../packages/polygon";
import { ITokenState } from "../../interfaces";

interface IAssetListModalProps {
  activeTokenInput: "A" | "B";
  tokenAHash?: string;
  tokenBHash?: string;
  onClose: () => void;
  onAssetClick: (token: ITokenState) => void;
}

const TokenList = ({
  tokenAHash,
  tokenBHash,
  onAssetClick,
  onClose,
  activeTokenInput,
}: IAssetListModalProps) => {
  const [isCustomInputMode, setCustomInputMode] = useState(false);

  return (
    <Modal onClose={onClose}>
      {isCustomInputMode ? (
        <ContractSearchInput onAssetClick={onAssetClick} />
      ) : (
        <>
          <div className="columns">
            {POLYGON_TOKENS.map((token) => {
              return (
                <SwapTokenCard
                  key={token.hash}
                  onClick={onAssetClick}
                  token={token}
                />
              );
            })}
          </div>

          <button
            onClick={() => setCustomInputMode(true)}
            className="button is-fullwidth is-black"
          >
            <span className="icon">
              <FaPlus />
            </span>
            <span>Custom contract hash</span>
          </button>
        </>
      )}
    </Modal>
  );
};

export default TokenList;

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

import ContractSearchInput from "./ContractSearchInput";
import SwapTokenCard from "../../../../components/TokenCard";
import Modal from "../../../../../../components/Modal";

import { ITokenState } from "../../interfaces";
import { TOKENS } from "../../../../../../../consts";
import { POLYGON_CHAIN } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";

interface IAssetListModalProps {
  network: INetworkType;
  activeTokenInput: "A" | "B";
  tokenAHash?: string;
  tokenBHash?: string;
  onClose: () => void;
  onAssetClick: (token: ITokenState) => void;
}

const TokenList = ({
  network,
  onAssetClick,
  onClose,
}: IAssetListModalProps) => {
  const [isCustomInputMode, setCustomInputMode] = useState(false);

  return (
    <Modal onClose={onClose}>
      {isCustomInputMode ? (
        <ContractSearchInput onAssetClick={onAssetClick} />
      ) : (
        <>
          <div className="columns">
            {TOKENS.SWAP_TOKEN_LIST[POLYGON_CHAIN][network].map((token) => {
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

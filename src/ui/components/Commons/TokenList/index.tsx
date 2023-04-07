import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

import ContractSearchInput from "./ContractSearchInput";
import SwapTokenCard from "../../../pages/Swap/components/TokenCard";
import Modal from "../../Modal";

import { ITokenState } from "../../../pages/Swap/scenes/Swap/interfaces";
import { TOKENS } from "../../../../consts";
import { CHAINS, POLYGON_CHAIN } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";

interface IAssetListModalProps {
  chain: CHAINS;
  network: INetworkType;
  activeTokenInput: "A" | "B" | undefined;
  tokenAHash?: string;
  tokenBHash?: string;
  onClose: () => void;
  onAssetClick: (token: ITokenState) => void;
}

const TokenList = ({
  chain,
  network,
  onAssetClick,
  onClose
}: IAssetListModalProps) => {
  const [isCustomInputMode, setCustomInputMode] = useState(false);

  return (
    <Modal onClose={onClose}>
      {isCustomInputMode ? (
        <ContractSearchInput onAssetClick={onAssetClick} />
      ) : (
        <>
          <div className="columns is-multiline is-mobile">
            {TOKENS.SWAP_TOKEN_LIST[chain][network].map((token) => {
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

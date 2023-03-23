import React, { useState } from "react";
import Modal from "../../../../../../components/Modal";
import { useWallet } from "../../../../../../../packages/provider";
import {
  SWAP_ASSET_CATEGORY,
  SWAP_ASSET_LIST
} from "../../../../../../../packages/neo/contracts/ftw/swap/consts";

import ContractSearchInput from "./ContractSearchInput";
import { FaPlus } from "react-icons/fa";
import {
  BNEO_SCRIPT_HASH,
  NEO_SCRIPT_HASH
} from "../../../../../../../packages/neo/consts/neo-token-hashes";
import { ITokenState } from "../../interfaces";
import SwapTokenCard from "../../../../components/TokenCard";
interface IAssetListModalProps {
  activeTokenInput: "A" | "B";
  tokenAHash?: string;
  tokenBHash?: string;
  onClose: () => void;
  onAssetClick: (token: ITokenState) => void;
  filterDecimals?: boolean; // This to know use of swap or locker
  noNEOBNEO?: boolean;
}

const AssetListModal = ({
  tokenAHash,
  tokenBHash,
  onAssetClick,
  onClose,
  activeTokenInput,
  filterDecimals,
  noNEOBNEO
}: IAssetListModalProps) => {
  const { network } = useWallet();
  const [isCustomInputMode, setCustomInputMode] = useState(false);
  const bNEOHash = BNEO_SCRIPT_HASH[network];
  let assets = SWAP_ASSET_LIST(network);

  assets = assets.filter((asset) => {
    if (activeTokenInput === "A" && tokenBHash && asset.hash === tokenBHash) {
      return false;
    }
    if (activeTokenInput === "B" && tokenAHash && asset.hash === tokenAHash) {
      return false;
    }
    if (
      noNEOBNEO &&
      tokenAHash === NEO_SCRIPT_HASH &&
      activeTokenInput === "B" &&
      asset.hash === bNEOHash
    ) {
      return false;
    }
    if (
      noNEOBNEO &&
      tokenBHash === NEO_SCRIPT_HASH &&
      activeTokenInput === "A" &&
      asset.hash === bNEOHash
    ) {
      return false;
    }
    if (
      noNEOBNEO &&
      tokenAHash === bNEOHash &&
      activeTokenInput === "B" &&
      asset.hash === NEO_SCRIPT_HASH
    ) {
      return false;
    }
    if (
      noNEOBNEO &&
      tokenBHash === bNEOHash &&
      activeTokenInput === "A" &&
      asset.hash === NEO_SCRIPT_HASH
    ) {
      return false;
    }
    return true;
  });

  return (
    <Modal onClose={onClose}>
      {isCustomInputMode ? (
        <ContractSearchInput
          onAssetClick={onAssetClick}
          network={network}
          filterDecimals={filterDecimals}
        />
      ) : (
        <div>
          {SWAP_ASSET_CATEGORY.map((category) => {
            return (
              <div key={category} className="block">
                <h5 className="title is-6 mb-3">{category} tokens</h5>
                <div className="columns is-multiline is-mobile">
                  {assets.map((asset) => {
                    if (asset.category !== category) return <></>;
                    return (
                      <SwapTokenCard
                        key={asset.hash}
                        onClick={onAssetClick}
                        token={asset}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
          <button
            onClick={() => setCustomInputMode(true)}
            className="button is-fullwidth is-black"
          >
            <span className="icon">
              <FaPlus />
            </span>
            <span>Custom contract hash</span>
          </button>
        </div>
      )}
    </Modal>
  );
};

export default AssetListModal;

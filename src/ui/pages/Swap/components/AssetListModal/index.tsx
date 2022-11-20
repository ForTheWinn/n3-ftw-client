import React, { useState } from "react";
import Modal from "../../../../components/Modal";
import { useWallet } from "../../../../../packages/provider";
import {
  SWAP_ASSET_CATEGORY,
  SWAP_ASSET_LIST,
} from "../../../../../packages/neo/contracts/ftw/swap/consts";

import ContractSearchInput from "./ContractSearchInput";
import SwapTokenCard from "./SwapTokenCard";
import { FaPlus } from "react-icons/fa";
interface IAssetListModalProps {
  activeTokenInput: "A" | "B";
  tokenAHash?: string;
  tokenBHash?: string;
  onClose: () => void;
  onAssetClick: (assetHash: string, symbol: string, decimals: number) => void;
  filterDecimals?: boolean; // This to know use of swap or locker
}

const AssetListModal = ({
  tokenAHash,
  tokenBHash,
  onAssetClick,
  onClose,
  activeTokenInput,
  filterDecimals,
}: IAssetListModalProps) => {
  const { network } = useWallet();
  const [isCustomInputMode, setCustomInputMode] = useState(false);

	let assets = SWAP_ASSET_LIST(network);

	assets = assets.filter((asset) => {
    if (
      activeTokenInput === "A" &&
      tokenBHash &&
      asset.contractHash === tokenBHash
    ) {
      return false;
    }
    if (
      activeTokenInput === "B" &&
      tokenAHash &&
      asset.contractHash === tokenAHash
    ) {
      return false;
    }
    return true;
  });

  return (
    <Modal onClose={onClose}>
      {isCustomInputMode ? (
        <ContractSearchInput onAssetClick={onAssetClick} network={network} filterDecimals={filterDecimals} />
      ) : (
        <div>
          {SWAP_ASSET_CATEGORY.map((category) => {
            return (
              <div key={category} className="block">
                <h5 className="title is-6 mb-3">{category} tokens</h5>
                <div className="columns is-multiline is-mobile">
                  {assets.map((asset) => {
                    if (asset.category !== category) return <></>;
                    return <SwapTokenCard key={asset.contractHash} onClick={onAssetClick} {...asset} />;
                  })}
                </div>
              </div>
            );
          })}
          <a
            onClick={() => setCustomInputMode(true)}
            className="button is-fullwidth is-black"
          >
            <span className="icon">
              <FaPlus />
            </span>
            <span>Custom contract hash</span>
          </a>
        </div>
      )}
    </Modal>
  );
};

export default AssetListModal;

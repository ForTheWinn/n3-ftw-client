import React, { useState } from "react";
import { IClaimableRewards } from "../../../../../packages/neo/contracts/ftw/farm/interfaces";
import ModalCard from "../../../../components/Modal";
import { toDecimal } from "../../../../../packages/neo/utils";
import ClaimList from "./ClaimList";
import { INetworkType } from "../../../../../packages/neo/network";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";

const ClaimModal = (props: {
  network: INetworkType;
  connectedWallet?: IConnectedWallet;
  refresh: number;
  pRefresh: number;
  items: IClaimableRewards[];
  onClaim: (v: IClaimableRewards[]) => void;
  onClose: () => void;
}) => {
  const [selectedItems, setSelectedItems] = useState<IClaimableRewards[]>(
    props.items
  );

  const handleToggle = (v: IClaimableRewards) => {
    let index: number | null = null;
    const arr = selectedItems;
    selectedItems.forEach((item, i) => {
      if (item.tokenA === v.tokenA && item.tokenB === v.tokenB) {
        index = i;
      }
    });
    if (index != null) {
      setSelectedItems(
        arr.filter((f) => f.tokenA !== v.tokenA || f.tokenB !== v.tokenB)
      );
    } else {
      setSelectedItems([...arr, v]);
    }
  };

  return (
    <>
      <ModalCard onClose={() => props.onClose()}>
        <>
          <h1 className="title is-5">Claim rewards</h1>
          <div className="box">
            <ClaimList
              handleToggle={handleToggle}
              isClaimNode={true}
              selectedItems={selectedItems}
              network={props.network}
              connectedWallet={props.connectedWallet}
              refresh={props.pRefresh}
              pRefresh={props.pRefresh}
            />
          </div>
          <button
            onClick={() => props.onClaim(selectedItems)}
            className="button is-primary is-fullwidth"
          >
            Claim
          </button>
        </>
      </ModalCard>
    </>
  );
};

export default ClaimModal;

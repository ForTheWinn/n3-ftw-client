import React, { useState } from "react";
import ModalCard from "../../../../components/Modal";
import ClaimList from "./ClaimList";
import { INetworkType } from "../../../../../packages/neo/network";
import { IClaimableRewards } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { IPrices } from "../../../../../packages/neo/api/interfaces";

const ClaimModal = (props: {
  bonus: number;
  network: INetworkType;
  rewards: IClaimableRewards[];
  prices?: IPrices;
  onClaim: (v: IClaimableRewards[]) => void;
  onClose: () => void;
}) => {
  const [selectedItems, setSelectedItems] = useState<IClaimableRewards[]>(
    props.rewards
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
              bonus={props.bonus}
              rewards={props.rewards}
              handleToggle={handleToggle}
              isClaimNode={true}
              selectedItems={selectedItems}
              network={props.network}
              prices={props.prices}
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

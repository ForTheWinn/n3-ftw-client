import React, { useState } from "react";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import ClaimModal from "./ClaimModal";
import { useApp } from "../../../../../common/hooks/use-app";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import ClaimList from "./ClaimList";
import { NEP_LOGO } from "../../../../../consts/global";
import { Avatar, message } from "antd";
import { WENT_WRONG } from "../../../../../consts/messages";

const ClaimRewards = () => {
  const { toggleWalletSidebar, network, setTxid, refreshCount } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);

  const onClaim = async (selectedItems) => {
    if (connectedWallet) {
      try {
        const res = await new StakingContract(network).claimMulti(
          connectedWallet,
          selectedItems
        );
        setClaimModalOpen(false);
        setTxid(res);
      } catch (e: any) {
        message.error(e.message ? e.message : WENT_WRONG);
      }
    } else {
      message.error("Please connect wallet");
    }
  };

  const { isLoaded, error, data } = useOnChainData(() => {
    return new StakingContract(network).getClaimable(connectedWallet);
  }, [connectedWallet, network, refreshCount]);

  return (
    <div>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <Avatar src={NEP_LOGO} />
          </div>
          <div className="level-item">
            <h1 className="title is-7 ">Rewards</h1>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <ClaimList
          handleToggle={(item) => {}}
          isClaimNode={false}
          selectedItems={[]}
          network={network}
          connectedWallet={connectedWallet}
          refresh={refreshCount}
        />
      </div>
      <button
        disabled={isLoaded && data.length === 0}
        onClick={() => {
          if (connectedWallet) {
            setClaimModalOpen(true);
          } else {
            toggleWalletSidebar();
          }
        }}
        className="button is-fullwidth is-primary mt-4"
      >
        {connectedWallet ? "Claim" : "Connect wallet"}
      </button>

      {isClaimModalOpen && (
        <ClaimModal
          network={network}
          connectedWallet={connectedWallet}
          refresh={refreshCount}
          items={data}
          onClose={() => setClaimModalOpen(false)}
          onClaim={onClaim}
        />
      )}
    </div>
  );
};

export default ClaimRewards;

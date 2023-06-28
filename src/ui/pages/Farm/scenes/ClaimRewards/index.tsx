import React, { useState } from "react";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import ClaimModal from "./ClaimModal";
import { toast } from "react-hot-toast";
import { useApp } from "../../../../../common/hooks/use-app";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { handleError } from "../../../../../packages/neo/utils/errors";
import ClaimList from "./ClaimList";
import { NEP_LOGO } from "../../../../../consts/global";
import { Avatar } from "antd";

interface IClaimRewardsProps {
  pRefresh: number;
}
const ClaimRewards = ({ pRefresh }: IClaimRewardsProps) => {
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
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const { isLoaded, error, data } = useOnChainData(() => {
    return new StakingContract(network).getClaimable(connectedWallet);
  }, [connectedWallet, network, refreshCount, pRefresh]);

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
          pRefresh={pRefresh}
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
          pRefresh={pRefresh}
          items={data}
          onClose={() => setClaimModalOpen(false)}
          onClaim={onClaim}
        />
      )}
    </div>
  );
};

export default ClaimRewards;

import React, { useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import ClaimModal from "./ClaimModal";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import { toast } from "react-hot-toast";
import { useApp } from "../../../../../common/hooks/use-app";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import LogoIcon from "../../../../components/LogoIcon";
import { NEP_LOGO } from "../../../../../packages/neo/contracts/ftw/farm/consts";
import { handleError } from "../../../../../packages/neo/utils/errors";
import ClaimList from "./ClaimList";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { IPrices } from "../../../../../packages/neo/api/interfaces";

interface IClaimRewardsProps {
  pRefresh: number;
  prices?: IPrices;
}
const ClaimRewards = ({ pRefresh, prices }: IClaimRewardsProps) => {
  const { toggleWalletSidebar } = useApp();
  const { network, connectedWallet } = useWallet();
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);

  const handleRefresh = () => {
    setRefresh(refresh + 1);
    setTxid("");
  };

  const onClaim = async (selectedItems) => {
    if (connectedWallet) {
      try {
        const res = await new FarmV2Contract(network).claimMulti(
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
    return new FarmV2Contract(network).getClaimable(connectedWallet);
  }, [connectedWallet, network, refresh, pRefresh]);

  return (
    <div>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <LogoIcon img={NEP_LOGO} />
          </div>
          <div className="level-item">
            <h1 className="title is-6 ">Rewards</h1>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <ClaimList
          prices={prices}
          handleToggle={(item) => {}}
          isClaimNode={false}
          selectedItems={[]}
          network={network}
          connectedWallet={connectedWallet}
          refresh={refresh}
          pRefresh={pRefresh}
        />
      </div>

      <button
        disabled={connectedWallet && isLoaded && data.length === 0}
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
          prices={prices}
          network={network}
          connectedWallet={connectedWallet}
          refresh={refresh}
          pRefresh={pRefresh}
          items={data}
          isLoaded={isLoaded}
          onClose={() => setClaimModalOpen(false)}
          onClaim={onClaim}
        />
      )}

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={handleRefresh}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClaimRewards;

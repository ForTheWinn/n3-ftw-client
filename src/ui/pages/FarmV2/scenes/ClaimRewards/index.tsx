import React, { useState } from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import ClaimModal from "./ClaimModal";
import { useApp } from "../../../../../common/hooks/use-app";
import ClaimList from "./ClaimList";
import BoyzStaking from "../../components/BoyzStaking";
import { Link } from "react-router-dom";
import { FARM_PATH } from "../../../../../consts/neoRoutes";
import { NEO_CHAIN } from "../../../../../consts/chains";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { farmRouter } from "../../../../../common/routers";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import toast from "react-hot-toast";
import { NEP_LOGO } from "../../../../../consts/global";
import { Avatar } from "antd";
import { WENT_WRONG } from "../../../../../consts/messages";

const ClaimRewards = () => {
  const {
    chain,
    toggleWalletSidebar,
    increaseRefreshCount,
    setTxid,
    refreshCount
  } = useApp();
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const { isConnected, address } = useWalletRouter(chain);
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);

  const onClaim = async (selectedItems) => {
    try {
      const txid = await farmRouter.claim(
        chain,
        network,
        selectedItems,
        connectedWallet
      );
      setTxid(txid);
    } catch (e: any) {
      toast.error(e.message ? e.message : WENT_WRONG);
    }
  };

  const onClickClaimModal = () => {
    if (isConnected) {
      setClaimModalOpen(true);
    } else {
      toggleWalletSidebar();
    }
  };

  let rewards = [];
  let boyz = [];
  let bonus = 0;

  const { data, error } = useOnChainData(
    () => farmRouter.getClaimable(chain, network, address),
    [chain, refreshCount, address]
  );

  if (data) {
    rewards = data.rewards;
    boyz = data.boyz;
    bonus = data.bonus;
  }

  return (
    <>
      {chain === NEO_CHAIN && (
        <div className="box is-shadowless mb-1">
          {connectedWallet ? (
            <BoyzStaking
              boyz={boyz}
              increaseRefreshCnt={increaseRefreshCount}
            />
          ) : (
            <div className="media" style={{ alignItems: "center" }}>
              <div className="media-left">
                <Avatar src={"/boyz/0.png"} />
              </div>
              <div className="media-content">
                <h1 className="title is-7 is-marginless">Stake Neo Boyz</h1>
                <a
                  target="_blank"
                  href="https://docs.forthewin.network/boyz#utilities"
                  className="is-size-6 has-text-grey-light"
                  rel="noreferrer"
                >
                  <small>Learn more</small>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="box is-shadowless mb-1">
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <Avatar src={NEP_LOGO} />
            </div>
            <div className="level-item">
              <h1 className="title is-6 ">Rewards</h1>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <ClaimList
            chain={chain}
            bonus={bonus}
            rewards={rewards}
            handleToggle={(item) => {}}
            isClaimNode={false}
            selectedItems={[]}
            network={network}
          />
        </div>

        <button
          disabled={isConnected && rewards.length === 0}
          onClick={onClickClaimModal}
          className="button is-fullwidth is-primary mt-4"
        >
          {isConnected ? "Claim" : "Connect wallet"}
        </button>
      </div>

      {chain === NEO_CHAIN && (
        <div className="has-text-centered">
          <Link to={FARM_PATH} className="button is-white is-block is-small">
            Legacy Farm
          </Link>
        </div>
      )}

      {isClaimModalOpen && (
        <ClaimModal
          chain={chain}
          bonus={bonus}
          network={network}
          rewards={rewards}
          onClose={() => setClaimModalOpen(false)}
          onClaim={onClaim}
        />
      )}
    </>
  );
};

export default ClaimRewards;

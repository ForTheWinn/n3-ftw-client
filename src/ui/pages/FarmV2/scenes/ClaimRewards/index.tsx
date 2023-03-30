import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/neo/provider";
import ClaimModal from "./ClaimModal";
import { useApp } from "../../../../../common/hooks/use-app";
import LogoIcon from "../../../../components/LogoIcon";
import { NEP_LOGO } from "../../../../../packages/neo/contracts/ftw/farm/consts";
import ClaimList from "./ClaimList";
import { IPrices } from "../../../../../packages/neo/api/interfaces";
import BoyzStaking from "../../components/BoyzStaking";
import { Link } from "react-router-dom";
import { FARM_PATH } from "../../../../../consts/pageRoutes";
import { CHAINS, NEO_CHAIN } from "../../../../../consts/chains";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { farmRouter } from "../../../../../common/routers";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import toast from "react-hot-toast";

interface IClaimRewardsProps {
  chain: CHAINS;
  path: string;
  prices?: IPrices;
}
const ClaimRewards = ({ chain, path, prices }: IClaimRewardsProps) => {
  const { toggleWalletSidebar, increaseRefreshCount, setTxid, refreshCount } = useApp();
  const { network, connectedWallet } = useWallet();
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
      toast.error(e.message ? e.message : "Something went wrong." );
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
    [refreshCount]
  );

  if (data) {
    rewards = data.rewards;
    boyz = data.boyz;
    bonus = data.bonus;
  }

  return (
    <>
      {chain === NEO_CHAIN && (
        <div className="box is-shadowless">
          {connectedWallet ? (
            <BoyzStaking
              boyz={boyz}
              increaseRefreshCnt={increaseRefreshCount}
            />
          ) : (
            <div className="media" style={{ alignItems: "center" }}>
              <div className="media-left">
                <div className="image is-32x32">
                  <img alt="Boyz staking" src="/boyz/0.png" />
                </div>
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

      <div className="box is-shadowless">
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
            bonus={bonus}
            rewards={rewards}
            prices={prices}
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
          <Link to={FARM_PATH} className="has-text-grey-light is-size-7">
            Go to legacy farm
          </Link>
        </div>
      )}

      {isClaimModalOpen && (
        <ClaimModal
          bonus={bonus}
          prices={prices}
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

import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import ClaimModal from "./ClaimModal";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import { toast } from "react-hot-toast";
import { useApp } from "../../../../../common/hooks/use-app";
import LogoIcon from "../../../../components/LogoIcon";
import { NEP_LOGO } from "../../../../../packages/neo/contracts/ftw/farm/consts";
import { handleError } from "../../../../../packages/neo/utils/errors";
import ClaimList from "./ClaimList";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { IPrices } from "../../../../../packages/neo/api/interfaces";
import BoyzStaking from "../../components/BoyzStaking";
import {
  IBoyStaked,
  IClaimableRewards,
} from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { Link } from "react-router-dom";
import { FARM_PATH } from "../../../../../consts/pageRoutes";

interface IClaimRewardsProps {
  prices?: IPrices;
}
const ClaimRewards = ({ prices }: IClaimRewardsProps) => {
  const { toggleWalletSidebar } = useApp();
  const { network, connectedWallet } = useWallet();
  const [isLoading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<IClaimableRewards[]>([]);
  const [boyz, setBoyz] = useState<IBoyStaked[]>([]);
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

  useEffect(() => {
    async function fetch(w) {
      setLoading(true);
      try {
        const res = await new FarmV2Contract(network).getClaimable(w);
        setRewards(res.rewards);
        setBoyz([...res.boyz]);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
      }
    }
    if (connectedWallet) {
      fetch(connectedWallet);
    } else {
      setLoading(false);
    }
  }, [connectedWallet, network, refresh]);

  let bonus = 0;
  let team = 0;
  boyz.forEach((b) => {
    if (b.tier === "1") {
      bonus = bonus + 1;
    } else if (b.tier === "2") {
      bonus = bonus + 0.75;
    } else if (b.tier === "3") {
      bonus = bonus + 0.5;
    }
    if (b.tokenId) {
      team++;
    }
  });
  if (team === 3) {
    bonus = bonus + 1;
  }

  return (
    <>
      <div className="box is-shadowless">
        {connectedWallet ? (
          <BoyzStaking
            boyz={boyz}
            increaseRefreshCnt={() => setRefresh(refresh + 1)}
          />
        ) : (
          <div className="media" style={{ alignItems: "center" }}>
            <div className="media-left">
              <div className="image is-32x32">
                <img src="/boyz/0.png" />
              </div>
            </div>
            <div className="media-content">
              <h1 className="title is-7 is-marginless">Stake Neo Boyz</h1>
              <a
                target="_blank"
                href="https://docs.forthewin.network/boyz#utilities"
                className="is-size-6 has-text-grey-light"
              >
                <small>Learn more</small>
              </a>
            </div>
          </div>
        )}
      </div>

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
          disabled={connectedWallet && isLoading && rewards.length === 0}
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
      </div>

      <div className="has-text-centered">
        <Link to={FARM_PATH} className="has-text-grey-light is-size-7">
          Go to legacy farm
        </Link>
      </div>

      {isClaimModalOpen && (
        <ClaimModal
          bonus={bonus}
          prices={prices}
          network={network}
          rewards={rewards}
          isLoading={isLoading}
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
    </>
  );
};

export default ClaimRewards;

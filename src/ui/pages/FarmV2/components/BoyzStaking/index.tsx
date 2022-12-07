import React, { useState } from "react";
import Modal from "../../../../components/Modal";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { useWallet } from "../../../../../packages/provider";
import DisplayBoy from "../MyBoyz/DisplayBoy";
import StakingModal from "./StakingModal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import toast from "react-hot-toast";
import { IBoyStaked } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";

interface IBoyzStakingProps {
  boyz: IBoyStaked[];
  increaseRefreshCnt: () => void;
}
const BoyzStaking = ({ boyz, increaseRefreshCnt }: IBoyzStakingProps) => {
  const [isModalActive, setModalActive] = useState(false);
  const [lot, setLot] = useState<IBoyStaked>();
  const [txid, setTxid] = useState("");
  const { network, connectedWallet } = useWallet();
  const handleStake = async (tokenId: string, lotNo: string) => {
    if (connectedWallet) {
      const res = await new FarmV2Contract(network).stakeBoy(
        connectedWallet,
        tokenId,
        lotNo
      );
      setTxid(res);
    } else {
      toast.error("Connect your wallet");
    }
  };
  const handleUnStake = async (tokenId: string, lotNo: string) => {
    if (connectedWallet) {
      const res = await new FarmV2Contract(network).UnStakeBoy(
        connectedWallet,
        tokenId,
        lotNo
      );
      setTxid(res);
    } else {
      toast.error("Connect your wallet");
    }
  };
  const onSuccess = () => {
    increaseRefreshCnt();
    setModalActive(false);
    setTxid("");
  };

  return (
    <>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="">
            <h1 className="title is-7 is-marginless">Stake Neo Boyz</h1>
            <a
              target="_blank"
              href="https://docs.forthewin.network/boyz#utilities"
              className="is-size-7 has-text-grey-light"
            >
              <small>Learn more</small>
            </a>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            {boyz.map((item) => {
              return (
                <div key={item.lotNo} className="image is-32x32">
                  <DisplayBoy
                    onClick={() => {
                      setModalActive(true);
                      setLot(item);
                    }}
                    network={network}
                    id={item.tokenId}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isModalActive && lot ? (
        <Modal onClose={() => setModalActive(false)}>
          <StakingModal
            onStake={handleStake}
            onUnStake={handleUnStake}
            lot={lot}
            network={network}
          />
        </Modal>
      ) : (
        <></>
      )}

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </>
  );
};

export default BoyzStaking;

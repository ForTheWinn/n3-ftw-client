import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { useWallet } from "../../../../../packages/provider";
import DisplayBoy from "../MyBoyz/DisplayBoy";
import StakingModal from "./StakingModal";
import { ILotState } from "./interfaces";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import toast from "react-hot-toast";

const BoyzStaking = (props) => {
  const [isModalActive, setModalActive] = useState(false);
  const [lot, setLot] = useState<ILotState>();
  const [isLoading, setLoading] = useState(true);
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState([
    {
      lotNo: "1",
      tokenId: "",
      tier: "",
      createdAt: "",
    },
    {
      lotNo: "2",
      tokenId: "",
      tier: "",
      createdAt: "",
    },
    {
      lotNo: "3",
      tokenId: "",
      tier: "",
      createdAt: "",
    },
  ]);
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
		setRefresh(refresh + 1)
		setModalActive(false);
		setTxid("");
	}

  useEffect(() => {
    async function fetch(w) {
      setLoading(true);
      try {
        const res = await new FarmV2Contract(network).getBoyStakingStatus(w);
        console.log(res);
        setData([
          {
            lotNo: "1",
            tokenId: res["1_tokenId"],
            tier: res["1_tier"],
            createdAt: res["1_createdAt"],
          },
          {
            lotNo: "2",
            tokenId: res["2_tokenId"],
            tier: res["2_tier"],
            createdAt: res["2_createdAt"],
          },
          {
            lotNo: "3",
            tokenId: res["3_tokenId"],
            tier: res["3_tier"],
            createdAt: res["3_createdAt"],
          },
        ]);
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
  }, [network, connectedWallet, refresh]);
  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <div className="columns">
          {data.map((item) => {
            return (
              <div key={item.lotNo} className="column">
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
      )}

      {isModalActive && lot ? (
        <Modal onClose={() => setModalActive(false)}>
          <StakingModal onStake={handleStake} onUnStake={handleUnStake} lot={lot} network={network} />
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

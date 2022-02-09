import React, { useEffect, useState } from "react";
import { useWallet } from "../../../packages/provider";
import { MAINNET } from "../../../packages/neo/consts";
import PageLayout from "../../components/PageLayout";
import FusionBox from "./components/FusionBox";
import RuneListModal from "./components/RuneListModal";
import CryptonautListModal from "./components/CryptonatuListModal";
import { toast } from "react-hot-toast";
import { FusionContract } from "../../../packages/neo/contracts/ftw/fuse";
import FusedList from "./components/FusedList";

const Fusion = () => {
  const { network, connectedWallet } = useWallet();
  const [isTTMModalActive, setTTMModalActive] = useState(false);
  const [isFTWModalActive, setFTWModalActive] = useState(false);
  const [cryptonaut, setCryptonaut] = useState<any>();
  const [rune, setRune] = useState<any>();

  const onFuse = async () => {
    if (connectedWallet) {
      try {
        const res = await new FusionContract(network).fuse(
          connectedWallet,
          cryptonaut.tokenId,
          rune.tokenId
        );
        console.log(res);
        // setTxid(res);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };

  if (network === MAINNET)
    return (
      <PageLayout>
        <div className="notification is-info">
          Fusion is not on Mainnet yet.{" "}
        </div>
      </PageLayout>
    );
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="block">
              <div className="columns">
                <div className="column">
                  <div className="box" onClick={() => setFTWModalActive(true)}>
                    <FusionBox
                      src={rune ? rune.image : "logo/FTW_512_512.svg"}
                    />
                  </div>
                </div>
                <div className="column">
                  <div className="box" onClick={() => setTTMModalActive(true)}>
                    <FusionBox
                      src={
                        cryptonaut
                          ? cryptonaut.image
                          : "assets/Cryptonaut.001.svg"
                      }
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={onFuse}
                className="is-primary button is-fullwidth"
                disabled={!rune || !cryptonaut}
              >
                Fuse
              </button>
            </div>
            <div className="block">
              <FusedList />
            </div>
          </div>
        </div>
      </PageLayout>
      {isFTWModalActive && (
        <RuneListModal
          onClick={(data) => setRune(data)}
          onClose={() => setFTWModalActive(false)}
        />
      )}
      {isTTMModalActive && (
        <CryptonautListModal
          onClick={(data) => setCryptonaut(data)}
          onClose={() => setTTMModalActive(false)}
        />
      )}
    </div>
  );
};

export default Fusion;

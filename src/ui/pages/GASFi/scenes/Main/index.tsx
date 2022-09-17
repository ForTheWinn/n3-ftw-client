import React, { useEffect, useState } from "react";
import StakeHeader from "./StakeHeader";
import { useWallet } from "../../../../../packages/provider";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import {
  IClaimableResult,
  IStakeResult,
  IStatusResult,
} from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import Countdown from "react-countdown";
import DrawBtn from "./DrawBtn";
import { withDecimal } from "../../../../../packages/neo/utils";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import History from "../History";

export interface IMainData {
  status: IStatusResult;
  staking?: IStakeResult;
  claimable?: IClaimableResult;
}

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span className="has-text-info is-size-7">Drawing in progress</span>;
  } else {
    // Render a countdown
    return (
      <span className="has-text-info is-size-7">
        Next drawing in {hours}:{minutes}:{seconds}
      </span>
    );
  }
};

const Main = (props) => {
  const { network, connectedWallet } = useWallet();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IMainData | undefined>(undefined);
  const [error, setError] = useState();
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  const onClaimAll = async () => {
    if (connectedWallet) {
      try {
        const tx = await new GasFiContract(network).claimAll(connectedWallet);
        setTxid(tx);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      // toggleWalletSidebar();
    }
  };

  const handleSuccess = () => {
    setRefresh(refresh + 1);
    setTxid("");
  };

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res1 = await new GasFiContract(network).getStatus();
        const res2 = connectedWallet
          ? await new GasFiContract(network).getStake(connectedWallet)
          : undefined;
        const claimable = connectedWallet
          ? await new GasFiContract(network).getClaimable(connectedWallet)
          : undefined;
        setData({
          status: res1,
          staking: res2,
          claimable,
        });
        setLoading(false);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [connectedWallet, network, refresh]);
	console.log(data)
  return (
    <div>
      <div className="columns is-centered">
        <div className="column is-half">
          <StakeHeader
            isLoading={isLoading}
            data={data}
            connectedWallet={connectedWallet}
          />

          {connectedWallet && data && data.staking ? (
            <div className="box">
              <div className="columns is-mobile content has-text-centered">
                <div className="column">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      {" "}
                      <h6>Claimable GAS</h6>
                      <p>
                        {data.claimable
                          ? withDecimal(data.claimable.claimableAmount, 8, true)
                          : "0"}{" "}
                        GAS
                      </p>
                    </div>
                  </div>
                </div>
                {data.claimable ? (
                  <div
                    className="column"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      disabled={data.claimable.claimableAmount === 0}
                      onClick={onClaimAll}
                      className="button is-primary"
                    >
                      Claim GAS
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="box is-shadowless">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <h6 className="title is-6">History</h6>
                </div>
              </div>

              <div className="level-right">
                <div className="level-item">
                  {data ? (
                    <Countdown
                      // date={Date.now() + 500000}
                      date={data && data.status.nextDrawingAt}
                      renderer={renderer}
                    >
                      <DrawBtn />
                    </Countdown>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>

            <History />
          </div>
        </div>
      </div>
      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={handleSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default Main;

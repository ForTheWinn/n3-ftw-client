import React, { useEffect, useState } from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { IStakeResult } from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { withDecimal } from "../../../../../packages/neo/utils";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import { useHistory } from "react-router-dom";
import { useApp } from "../../../../../common/hooks/use-app";
import moment from "moment";
import { DRAWING_FREQUENCY } from "../../../../../packages/neo/contracts/ftw/gas-fi/consts";
import { NEO_ROUTES } from "../../../../../consts";

const MyStaking = () => {
  const history = useHistory();
  const { toggleWalletSidebar } = useApp();
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IStakeResult | undefined>(undefined);
  const [error, setError] = useState();
  const [txid, setTxid] = useState("");

  const onSubmit = async () => {
    if (connectedWallet) {
      try {
        const tx = await new GasFiContract(network).unStake(connectedWallet);
        setTxid(tx);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      // toggleWalletSidebar();
    }
  };

  const handleSuccess = () => {
    setTxid("");
    history.push(NEO_ROUTES.GASFI_PATH);
  };

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new GasFiContract(network).getStake(connectedWallet);
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [connectedWallet, network]);
  let canUnstake = false;

  if (data) {
    const now = moment().valueOf();
    const canUnstakeAfter = parseFloat(data.stakedAt) + DRAWING_FREQUENCY;
    if (now > canUnstakeAfter) {
      canUnstake = true;
    }
    console.log(parseFloat(data.stakedAt) + DRAWING_FREQUENCY);
  }

  return (
    <div>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <HeaderBetween path={NEO_ROUTES.GASFI_PATH} title={"My staking"} />
          </div>
          {!connectedWallet ? (
            <button
              onClick={toggleWalletSidebar}
              className="button is-primary is-fullwidth"
            >
              Connect wallet
            </button>
          ) : isLoading ? (
            <></>
          ) : data ? (
            <div className="content has-text-centered">
              <div className="columns">
                <div className="column">
                  <div className="box is-shadowless">
                    <h6>Total bNEO</h6>
                    <p>{data ? withDecimal(data.amount, 8, true) : ""}</p>
                  </div>
                </div>
                <div className="column">
                  <div className="box is-shadowless">
                    <h6>Position</h6>
                    <p>{data ? data.position : ""}</p>
                  </div>
                </div>
              </div>
              {data && !canUnstake ? (
                <div className={" mb-5"}>
                  You can unstake after{" "}
                  {moment(parseFloat(data.stakedAt) + DRAWING_FREQUENCY).format(
                    "lll"
                  )}
                </div>
              ) : (
                <></>
              )}
              <button
                disabled={!canUnstake}
                onClick={onSubmit}
                className="button is-danger is-fullwidth"
              >
                UnStake
              </button>
            </div>
          ) : (
            <div className="box is-shadowless">There is no staking.</div>
          )}
        </div>

        {/*<div className="columns">*/}
        {/*  <div className="column">*/}
        {/*    <div className="box is-shadowless">Last position</div>*/}
        {/*  </div>*/}
        {/*  <div className="column">*/}
        {/*    <div className="box is-shadowless">Next drawing at</div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className="box is-shadowless">History</div>*/}
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

export default MyStaking;

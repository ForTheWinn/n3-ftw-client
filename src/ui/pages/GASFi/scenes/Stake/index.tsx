import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { POSITION_RANGE } from "../../../../../packages/neo/contracts/ftw/gas-fi/consts";
import { useWallet } from "../../../../../packages/provider";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import { toast } from "react-hot-toast";
import { useApp } from "../../../../../common/hooks/use-app";
import { useHistory } from "react-router-dom";
import { GASFI_PATH } from "../../../../../consts";
import { IMainData } from "../Main";

const Stake = (props) => {
  const history = useHistory();
  const { toggleWalletSidebar } = useApp();
  const [position, setPosition] = useState<number | undefined>();
  const [amount, setAmount] = useState<number | undefined>();
  const { connectedWallet, network } = useWallet();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IMainData | undefined>(undefined);
  const [error, setError] = useState();
  const [txid, setTxid] = useState("");

  const onSubmit = async () => {
    if (connectedWallet && amount && position) {
      try {
        const res = await new GasFiContract(network).getStake(connectedWallet);
        if (res) {
          toast.error("You already have staking.");
          return false;
        }
        const tx = await new GasFiContract(network).stake(
          connectedWallet,
          amount,
          position
        );
        setTxid(tx);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      toggleWalletSidebar();
    }
  };

  const handleSuccess = () => {
    setTxid("");
    history.push(GASFI_PATH);
  };

  const handleClickBalance = () => {
    if (data && data.bNEOBalance) {
      setAmount(data.bNEOBalance);
    }
  };

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new GasFiContract(network).getStatus(connectedWallet);
        setData(res);
        setLoading(false);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [connectedWallet, network]);

  const hasEnoughBalance = !!(
    data &&
    data.bNEOBalance &&
    amount &&
    data.bNEOBalance >= amount
  );

  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <div className="columns">
          <div className="column is-8">
            <div className="box is-shadowless">
              <h5 className="title is-5">Stake bNEO</h5>
              <hr />
              <label className="label mb-4">Choose your position</label>
              <div className="columns is-mobile">
                {Array.from(Array(POSITION_RANGE), (e, i) => {
                  const p = i + 1;
                  return (
                    <div key={i} className="column">
                      <button
                        onClick={() => setPosition(p)}
                        className={`button is-fullwidth ${
                          position === p ? "is-info is-active" : ""
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="field">
                <label className="label mb-4">Amount</label>
                <div className="control">
                  <NumberFormat
                    allowLeadingZeros={false}
                    suffix={" bNEO"}
                    thousandSeparator={true}
                    allowNegative={false}
                    decimalScale={8}
                    inputMode="decimal"
                    className="input"
                    placeholder={"bNEO amount"}
                    value={amount}
                    onValueChange={(value) => {
                      setAmount(value.floatValue);
                    }}
                  />
                  {connectedWallet && data && data.bNEOBalance ? (
                    <p
                      onClick={handleClickBalance}
                      className="help has-text-right is-clickable"
                    >
                      {data.bNEOBalance} bNEO
                    </p>
                  ) : (
                    <p className="help"></p>
                  )}
                </div>
              </div>

              <hr />

              {connectedWallet ? (
                <button
                  onClick={onSubmit}
                  disabled={!hasEnoughBalance || !position}
                  className="button is-primary"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={toggleWalletSidebar}
                  className="button is-primary"
                >
                  Connect wallet
                </button>
              )}
            </div>
          </div>
          <div className="column is-4">
            <>
              <div className="box is-shadowless">
                <div className="content is-small">
                  <li>
                    Fee is{" "}
                    <span className="has-text-primary has-text-weight-bold">
                      {" "}
                      100 NEP
                    </span>
                  </li>
                  <li>
                    There is no way to get tokens back earlier than the release
                    time.
                  </li>
                  <li>
                    Do not use <strong>Emojis</strong>.
                  </li>
                </div>
              </div>
            </>
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

export default Stake;

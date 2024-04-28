import React from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { useApp } from "../../../../../common/hooks/use-app";
import { useHistory } from "react-router-dom";
import About from "./About";
import { GASFI_PATH } from "../../../../../consts/routes";
import { message } from "antd";
import { IStatusForSpin } from ".";

const Stake = ({ data }: { data: IStatusForSpin }) => {
  const history = useHistory();
  const { toggleWalletSidebar } = useApp();
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();

  const onSubmit = async () => {
    if (connectedWallet) {
      try {
        const tx = await new GasFiContract(network).stake(connectedWallet);
        setTxid(tx);
      } catch (e: any) {
        message.error(e.message);
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
    // if (data && data.bNEOBalance) {
    //   setAmount(data.bNEOBalance);
    // }
  };

  const hasEnoughBalance = data && data.userbNEOBalance >= 1;

  return (
    <>
      <h5 className="title is-5">Stake bNEO and Spin</h5>
      <hr /> <About network={network} />
      {/* <div className="columns is-mobile">
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
              </div> */}
      <div className="field">
        {/* {connectedWallet && data && data.bNEOBalance ? (
                    <p
                      onClick={handleClickBalance}
                      className="help has-text-right is-clickable"
                    >
                      {data.bNEOBalance} bNEO
                    </p>
                  ) : (
                    <p className="help"></p>
                  )} */}
      </div>
      <hr />
      {connectedWallet ? (
        <button
          onClick={onSubmit}
          disabled={!hasEnoughBalance}
          className="button is-primary"
        >
          Submit
        </button>
      ) : (
        <button onClick={toggleWalletSidebar} className="button is-primary">
          Connect wallet
        </button>
      )}
    </>
  );
};

export default Stake;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IMainData } from "./index";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import { useApp } from "../../../../../common/hooks/use-app";
import { withDecimal } from "../../../../../packages/neo/utils";
import ModalCard from "../../../../components/Modal";
import About from "./About";
import moment from "moment";
import Countdown from "react-countdown";
import DrawBtn from "./DrawBtn";
import {
  GASFI_MY_STAKING_PATH,
  GASFI_STAKE_PATH
} from "../../../../../consts/routes";

interface IStakeHeaderProps {
  isLoading: boolean;
  data?: IMainData;
  connectedWallet?: IConnectedWallet;
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <>(In progress)</>;
  } else {
    // Render a countdown
    return (
      <>
        (In {days}:{hours}:{minutes}:{seconds})
      </>
    );
  }
};

const StakeHeader = ({
  isLoading,
  data,
  connectedWallet
}: IStakeHeaderProps) => {
  const { toggleWalletSidebar } = useApp();
  const [isInfoModalActive, setInfoModalActive] = useState(false);
  return (
    <div className="box is-shadowless">
      <div className="columns is-multiline">
        <div className="column">
          <div className="media" style={{ alignItems: "center" }}>
            <div className="media-left">
              <figure className="image is-64x64">
                <img src="/symbols/bneo.jpeg" alt="bNEO logo" />
              </figure>
            </div>
            <div className="media-content">
              <strong>Total staked</strong>
              <br />
              {data ? withDecimal(data.status.totalNEO, 8, true) : ""} bNEO
              <br />
              {data ? (
                <div className="is-size-7">
                  Next drawing after&nbsp;
                  {moment(data.status.nextDrawingAt).format(
                    "MMM/DD H:MM A"
                  )}{" "}
                  <br />
                  <Countdown
                    // date={Date.now() + 500000}
                    date={data && data.status.nextDrawingAt}
                    renderer={renderer}
                  >
                    <DrawBtn />
                  </Countdown>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="media-right"></div>
          </div>
        </div>
        <div
          className="column is-narrow"
          style={{
            display: "flex",
            // justifyContent: "end",
            alignItems: "center"
          }}
        >
          <div className="is-pulled-right">
            {connectedWallet ? (
              <Link
                to={
                  data && data.staking
                    ? GASFI_MY_STAKING_PATH
                    : GASFI_STAKE_PATH
                }
                className={`button ${
                  isLoading ? "is-loading is-white" : "is-primary"
                }`}
              >
                {isLoading ? "" : data && data.staking ? "MyStake" : "Stake"}
              </Link>
            ) : (
              <div className="buttons">
                <button
                  onClick={toggleWalletSidebar}
                  className="button is-primary"
                >
                  Stake
                </button>
                <button
                  onClick={() => setInfoModalActive(true)}
                  className="button is-light"
                >
                  About
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isInfoModalActive && (
        <ModalCard onClose={() => setInfoModalActive(false)}>
          <About />
        </ModalCard>
      )}
    </div>
  );
};

export default StakeHeader;

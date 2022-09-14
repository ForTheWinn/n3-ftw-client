import React from "react";
import { u } from "@cityofzion/neon-core";
import { Link } from "react-router-dom";
import { GASFI_MY_STAKING_PATH, GASFI_STAKE_PATH } from "../../../../../consts";
import { IMainData } from "./index";
import { IConnectedWallet } from "../../../../../packages/neo/wallet/interfaces";
import { useApp } from "../../../../../common/hooks/use-app";

interface IStakeHeaderProps {
  isLoading: boolean;
  data?: IMainData;
  connectedWallet?: IConnectedWallet;
}
const StakeHeader = ({
  isLoading,
  data,
  connectedWallet,
}: IStakeHeaderProps) => {
  const { toggleWalletSidebar } = useApp();
  return (
    <div className="box is-shadowless">
      <div className="columns">
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
              {data
                ? u.BigInteger.fromNumber(data.status.totalNEO).toDecimal(8)
                : ""}{" "}
              bNEO
            </div>
            <div className="media-right">
              {connectedWallet ? (
                <Link
                  to={
                    data && data.staking
                      ? GASFI_MY_STAKING_PATH
                      : GASFI_STAKE_PATH
                  }
                  className={`button ${
                    isLoading ? "is-loading is-white" : "is-primary "
                  }`}
                >
                  {isLoading ? "" : data && data.staking ? "MyStake" : "Stake"}
                </Link>
              ) : (
                <button
                  onClick={toggleWalletSidebar}
                  className="button is-primary"
                >
                  Connect wallet to stake
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeHeader;

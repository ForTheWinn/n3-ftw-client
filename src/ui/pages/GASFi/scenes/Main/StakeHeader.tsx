import React from "react";
import { wallet } from "@cityofzion/neon-core";
import toast from "react-hot-toast";
import { LOCKER_NEP_FEE } from "../../../../../packages/neo/contracts/ftw/locker/consts";
import { LockerContract } from "../../../../../packages/neo/contracts/ftw/locker";
import moment from "moment";
import { useWallet } from "../../../../../packages/provider";
import { Link } from "react-router-dom";
import {
  GASFI_MY_STAKING_PATH,
  GASFI_PATH,
  GASFI_STAKE_PATH,
} from "../../../../../consts";
import { IMainData } from "./index";

interface IStakeHeaderProps {
  isLoading: boolean;
  data?: IMainData;
}
const StakeHeader = ({ isLoading, data }: IStakeHeaderProps) => {
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
              100,000 bNEO
            </div>
            <div className="media-right">
              <Link
                to={data ? GASFI_MY_STAKING_PATH : GASFI_STAKE_PATH}
                className={`button ${
                  isLoading ? "is-loading is-white" : "is-primary "
                }`}
              >
                {isLoading ? "" : data ? "MyStake" : "Stake"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeHeader;

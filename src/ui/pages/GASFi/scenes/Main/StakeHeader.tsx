import React, {useState} from "react";
import { Link } from "react-router-dom";
import { GASFI_MY_STAKING_PATH, GASFI_STAKE_PATH } from "../../../../../consts";
import { IMainData } from "./index";
import { IConnectedWallet } from "../../../../../packages/neo/wallet/interfaces";
import { useApp } from "../../../../../common/hooks/use-app";
import { withDecimal } from "../../../../../packages/neo/utils";
import ModalCard from "../../../../components/Modal";
import About from "./About";

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
	const [isInfoModalActive, setInfoModalActive] = useState(false);
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
                ? withDecimal(data.status.totalNEO, 8, true)
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
                    isLoading ? "is-loading is-white" : "is-light"
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

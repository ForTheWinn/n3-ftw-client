import React, { useState } from "react";
import { getWalletIcon } from "./helpers";
import { IETHWalletType } from "../../../neo/wallet/interfaces";
import { truncateAddress } from "../../../neo/utils";

interface IDisplayConnectedWalletProps {
  walletKey: IETHWalletType;
  account: string;
  disConnectWallet: () => void;
}
const DisplayConnectedWallet = ({
  walletKey,
  account,
  disConnectWallet,
}: IDisplayConnectedWalletProps) => {
  const [isActive, setActive] = useState(false);
  return (
    <div>
      <div
        style={{ width: "100%" }}
        className={`dropdown ${isActive ? "is-active" : ""}`}
      >
        <div style={{ width: "100%" }} className="dropdown-trigger">
          <button
            style={{ justifyContent: "flex-start" }}
            className="button is-fullwidth"
            aria-haspopup="true"
            aria-controls="disconnect-menu"
            onClick={() => setActive(!isActive)}
          >
            <span className="panel-icon">
              <img alt={walletKey} src={getWalletIcon(walletKey)} />
            </span>
            <span>{truncateAddress(account)}</span>
          </button>
        </div>
        <div className="dropdown-menu" id="disconnect-menu" role="menu">
          <div className="dropdown-content">
            <a onClick={disConnectWallet} className="dropdown-item">
              Disconnect
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayConnectedWallet;

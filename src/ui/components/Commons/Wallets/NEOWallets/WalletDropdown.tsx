import React, { useState } from "react";
// tslint:disable-next-line:no-submodule-imports
import { FaAngleDown } from "react-icons/fa";
import { useApp } from "../../../../../common/hooks/use-app";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { getWalletIcon } from "./helpers";

const WalletDropdown = () => {
  const [isActive, setActive] = useState(false);
  const { disConnectWallet, connectedWallet } = useNeoWallets();
  const { toggleWalletSidebar } = useApp();
  const handleDisconnectWallet = () => {
    setActive(false);
    toggleWalletSidebar();
    disConnectWallet();
  };
  if (!connectedWallet) {
    return (
      <button className="button is-white " onClick={() => setActive(!isActive)}>
        <strong>Wallet</strong>
      </button>
    );
  }
  return (
    <div className={`dropdown ${isActive && "is-active"}`}>
      <div className="dropdown-trigger">
        <button
          className="button is-white"
          aria-haspopup="true"
          aria-controls="dropdown-menu3"
          onClick={() => setActive(!isActive)}
        >
          <span className="icon is-small">
            <img src={getWalletIcon(connectedWallet.key)} />
          </span>
          <span>
            <strong>Wallet</strong>
          </span>
          <span className="icon is-small">
            <FaAngleDown />
            {/*<i className="fas fa-angle-down" aria-hidden="true"></i>*/}
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu3" role="menu">
        <div className="dropdown-content">
          <a
            onClick={handleDisconnectWallet}
            href="src/packages/ui/Wallet/NEOWallets/WalletDropdown#"
            className="dropdown-item"
          >
            Disconnect
          </a>
          {/*<hr className="dropdown-divider"/>*/}
        </div>
      </div>
    </div>
  );
};

export default WalletDropdown;

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaWallet } from "react-icons/fa";
import Logo from "./Logo";
import { useApp } from "../../common/hooks/use-app";
import { useWallet } from "../../packages/provider";
import { utils } from "../../packages/neo";
import WalletDropdown from "./WalletDropdown";
import { TESTNET } from "../../packages/neo/consts";
import { getWalletIcon } from "../../packages/ui/Wallet/NEOWallets/helpers";
import ChainSwitch from "./ChainSwitch";
import { HeaderMenu } from "./HeaderMenu";

const Header = () => {
  const { toggleSidebar, toggleWalletSidebar, chain } = useApp();
  const { connectedWallet, network, disConnectWallet } = useWallet();
  const [isActive, setActive] = useState(false);
  const handleDisconnectWallet = () => {
    setActive(false);
    disConnectWallet();
  };

  return (
    <nav
      className="navbar has-shadow is-white is-fixed-top"
      role="navigation"
      aria-label="main navigation"
      style={{ height: "52px" }}
    >
      <div className="container">
        <div
          className="navbar-brand"
          style={{ justifyContent: "space-between" }}
        >
          <div
            role="button"
            className="navbar-burger is-center is-hidden-desktop"
            style={{ marginLeft: 0 }}
            onClick={toggleSidebar}
          >
            <FaBars />
          </div>
          <Link className="is-center" to="/">
            <Logo />
            {process.env.REACT_APP_NETWORK === TESTNET ? (
              <span className="heading is-marginless has-text-danger">
                Testnet
              </span>
            ) : (
              <></>
            )}
          </Link>
          <div
            role="button"
            className={`navbar-burger is-center is-hidden-desktop`}
            onClick={toggleWalletSidebar}
            style={{ marginLeft: 0 }}
          >
            <FaWallet />
          </div>
        </div>
        {connectedWallet && (
          <div
            className={`navbar-menu  is-hidden-tablet ${
              isActive && "is-active"
            }`}
          >
            <div className="navbar-start">
              <div className="navbar-item">
                <div className="media" style={{ alignItems: "center" }}>
                  <div className="media-left">
                    <img
                      alt="logo"
                      width="32px"
                      src={getWalletIcon(connectedWallet.key)}
                    />
                  </div>
                  <div className="media-content">
                    {utils.truncateAddress(connectedWallet.account.address)}
                  </div>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <button onClick={handleDisconnectWallet} className="navbar-item">
                Disconnect wallet
              </button>
            </div>
          </div>
        )}

        <div className="navbar-menu ml-3">
          <div className="navbar-start">
            <HeaderMenu chain={chain} network={network} />
          </div>
        </div>
        <div className="navbar-end is-hidden-touch">
          <div className="navbar-item">
            <ChainSwitch />
          </div>
          {/*<PendingTransaction />*/}
          <div className="navbar-item">
            <div className="buttons">
              {connectedWallet ? (
                <WalletDropdown connectedWallet={connectedWallet} />
              ) : (
                <button
                  onClick={toggleWalletSidebar}
                  className="button is-small is-black is-rounded"
                >
                  Connect wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

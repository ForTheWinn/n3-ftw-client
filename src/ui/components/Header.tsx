import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaWallet } from "react-icons/fa";
import Logo from "./Logo";
import { useApp } from "../../common/hooks/use-app";
import { useWallet } from "../../packages/provider";
import { utils } from "../../packages/neo";
import { MENU } from "../../consts";
import WalletDropdown from "./WalletDropdown";
import NetworkSwitch2 from "./NetworkSwitch2";
import SocialLinkGroup from "./SocialLinkGroup";
import { TESTNET } from "../../packages/neo/consts";
import { getWalletIcon } from "../../packages/ui/Wallet/NEOWallets/helpers";

const Header = () => {
  const { toggleSidebar, toggleWalletSidebar } = useApp();
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

        <div className="navbar-menu ml-3">
          <div className="navbar-start">
            {MENU.map((route, i) => {
              if (!route.network.includes(network)) return false;
              if (route.category.length > 0) {
                return (
                  <div
                    key={`header-${route.label}${i}`}
                    className="navbar-item has-dropdown is-hoverable"
                  >
                    <div className="navbar-link">{route.label}</div>
                    <div className="navbar-dropdown is-boxed">
                      {route.category.map((item, index) => {
                        return (
                          <NavLink
                            key={`category-${item.label}-${item.label}${index}`}
                            activeClassName="is-active"
                            to={item.path}
                            className="navbar-item"
                          >
                            {item.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return (
                  <NavLink
                    key={`header-${route.label}${i}`}
                    activeClassName="is-active"
                    to={route.path}
                    className="navbar-item"
                  >
                    {route.label}
                  </NavLink>
                );
              }
            })}
          </div>
        </div>
        <div className="navbar-end is-hidden-touch">
          {/*<a*/}
          {/*  target={"_blank"}*/}
          {/*  className="navbar-item"*/}
          {/*  href={"http://docs.forthewin.network/"}*/}
          {/*>*/}
          {/*  <span className="ml-1">Docs</span>*/}
          {/*</a>*/}

          {/*<div className="navbar-item">*/}
          {/*  <SocialLinkGroup />*/}
          {/*</div>*/}

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

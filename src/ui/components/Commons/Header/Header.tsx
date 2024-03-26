import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaWallet } from "react-icons/fa";
import Logo from "./Logo";
import { useApp } from "../../../../common/hooks/use-app";
import DisplayConnectedWallets from "./DisplayConnectedWallets";
import ChainSwitch from "./ChainSwitch";
import { HeaderMenu } from "./HeaderMenu";
import DisplayCurrentChain from "./DisplayCurrentChain";
import { TESTNET } from "../../../../consts/global";

const Header = () => {
  const { toggleSidebar, toggleWalletSidebar, chain } = useApp();
  const { network } = useApp();

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
          <Link className="is-center is-hidden-touch" to="/">
            <Logo />
            {process.env.REACT_APP_NETWORK === TESTNET ? (
              <span className="is-accent is-marginless has-text-danger">
                Testnet
              </span>
            ) : (
              <></>
            )}
          </Link>
          <div
            className={"is-hidden-desktop is-flex"}
            style={{ alignItems: "center" }}
          >
            <DisplayCurrentChain />
          </div>

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
            <HeaderMenu chain={chain} network={network} />
          </div>
        </div>
        <div className="navbar-end is-hidden-touch">
          <div className="navbar-item">
            <ChainSwitch />
          </div>
          <div className="navbar-item">
            <div className="buttons">
              <DisplayConnectedWallets />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

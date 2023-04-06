import React, { useState } from "react";
import { MAINNET, TESTNET } from "../../../consts/global";
import { useApp } from "../../../common/hooks/use-app";

const NetworkSwitch = () => {
  const [isActive, setActive] = useState(false);
  const { network } = useApp();
  const onActive = () => setActive(!isActive);
  const handleNetworkChange = (val: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure to switch network?")) {
      setActive(false);
    }
  };
  const networkList = [TESTNET, MAINNET];

  return (
    <div className={`dropdown is-right ${isActive ? "is-active" : ""}`}>
      <div className="dropdown-trigger">
        <button
          onClick={onActive}
          className={`button is-small ${
            network === MAINNET ? "is-white" : "is-danger"
          }`}
          aria-controls="dropdown-wallet"
        >
          {network}
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-wallet" role="menu">
        <div className="dropdown-content">
          {networkList.map((v) => {
            if (process.env.NODE_ENV !== "development" || network === v) {
              return false;
            }
            return (
              <div key={`network${v}`} className="dropdown-item">
                <a onClick={() => handleNetworkChange(v)}>Switch to {v}</a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NetworkSwitch;

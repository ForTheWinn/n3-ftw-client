import React, { useState } from "react";
import { chainList, CHAINS, chainThemes } from "../../../../consts/chains";
import { useApp } from "../../../../common/hooks/use-app";

const ChainSwitch = () => {
  const [isActive, setActive] = useState(false);
  const { chain, switchChain } = useApp();
  const onActive = () => setActive(!isActive);
  const handleSwitch = async (v: CHAINS) => {
    switchChain(v);
    onActive();
  };
  return (
    <div className={`dropdown is-right ${isActive ? "is-active" : ""}`}>
      <div className="dropdown-trigger">
        <button
          onClick={onActive}
          className={`button is-small is-rounded is-${chainThemes[chain].color}`}
          aria-controls="dropdown-wallet"
        >
          {chainThemes[chain].label}
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-wallet" role="menu">
        <div className="dropdown-content">
          {chainList.map((v) => {
            if (chain === v) {
              return false;
            }
            return (
              <div key={`chain${v}`} className="dropdown-item">
                <button
                  className={`button is-fullwidth is-small is-rounded is-${chainThemes[v].color}`}
                  onClick={() => handleSwitch(v as CHAINS)}
                >
                  Switch to {chainThemes[v].label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChainSwitch;

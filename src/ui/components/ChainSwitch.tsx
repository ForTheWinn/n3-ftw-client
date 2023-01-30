import React, { useState } from "react";
import { chainList, CHAINS, chainThemes } from "../../packages/chains/consts";
import { useApp } from "../../common/hooks/use-app";
import { useWeb3React } from "@web3-react/core";

const ChainSwitch = () => {
   const web3 = useWeb3React();
  const [isActive, setActive] = useState(false);
  const { chain, switchChain } = useApp();
  const onActive = () => setActive(!isActive);
  const handleSwitch = async(v: CHAINS) => {
    switchChain(v);
    onActive();
    // try {
    //   const res = await web3.connector
    //     .activate(80001);
    //   console.log(res)
    //   console.log(web3.connector);
    //   console.log(web3.provider?.network);
    // } catch (e) {
    //   console.log(e)
    // }
  };
  return (
    <div className={`dropdown is-right ${isActive ? "is-active" : ""}`}>
      <div className="dropdown-trigger">
        <button
          onClick={onActive}
          className={`button is-small is-rounded is-outlined is-${chainThemes[chain].color}`}
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
                  className={`button is-small is-rounded is-${chainThemes[v].color}`}
                  onClick={() => handleSwitch(v as CHAINS)}
                >
                  Switch to {v}
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

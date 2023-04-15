import React, { useState } from "react";
import { CHAINS } from "../../../../consts";
import { useApp } from "../../../../common/hooks/use-app";
import Avatar from "antd/es/avatar/avatar";
import { Space, Switch } from "antd";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../../consts/chains";

const ChainSwitch = () => {
  const [isActive, setActive] = useState(false);
  const { chain, switchChain } = useApp();
  const onActive = () => setActive(!isActive);
  const handleSwitch = async (v: CHAINS.CHAINS) => {
    switchChain(v);
    onActive();
  };
  return (
    <div className={`dropdown is-right ${isActive ? "is-active" : ""}`}>
      <div className="dropdown-trigger">
        <button
          onClick={onActive}
          className={`button is-small is-rounded is-${CHAINS.CONFIGS[chain].color}`}
          aria-controls="dropdown-wallet"
        >
          {CHAINS.CONFIGS[chain].label}
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-wallet" role="menu">
        <div className="dropdown-content">
          {CHAINS.LIST.map((v) => {
            if (chain === v) {
              return false;
            }
            return (
              <div key={`chain${v}`} className="dropdown-item">
                <button
                  className={`button is-fullwidth is-small is-${CHAINS.CONFIGS[v].color}`}
                  onClick={() => handleSwitch(v as CHAINS.CHAINS)}
                >
                  <Space>
                    <Avatar
                      style={{ background: "white" }}
                      size="small"
                      src={CHAINS.CONFIGS[v].icon}
                    />
                    <span>{CHAINS.CONFIGS[v].label}</span>
                  </Space>
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

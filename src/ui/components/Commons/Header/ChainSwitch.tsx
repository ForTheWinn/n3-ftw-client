import React, { useState } from "react";
import { useApp } from "../../../../common/hooks/use-app";
import Avatar from "antd/es/avatar/avatar";
import { Space } from "antd";
import { CHAINS, CONFIGS, LIST } from "../../../../consts/chains";

const ChainSwitch = () => {
  const [isActive, setActive] = useState(false);
  const { chain, network, switchChain } = useApp();
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
          className={`button is-small is-rounded is-${CONFIGS[network][chain].color}`}
          aria-controls="dropdown-wallet"
        >
          {CONFIGS[network][chain].label}
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-wallet" role="menu">
        <div className="dropdown-content">
          {LIST.map((v) => {
            if (chain === v) {
              return false;
            }
            return (
              <div key={`chain${v}`} className="dropdown-item">
                <button
                  className={`button is-fullwidth is-small is-${CONFIGS[network][v].color}`}
                  onClick={() => handleSwitch(v as CHAINS)}
                >
                  <Space>
                    <Avatar
                      style={{ background: "white" }}
                      size="small"
                      src={CONFIGS[network][v].icon}
                    />
                    <span>{CONFIGS[network][v].label}</span>
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

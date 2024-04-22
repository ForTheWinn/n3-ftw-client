import React, { useState } from "react";
import { useApp } from "../../../../common/hooks/use-app";
import Avatar from "antd/es/avatar/avatar";
import { Button, Space } from "antd";
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
        <Button onClick={onActive} aria-controls="dropdown-wallet">
          <Space>
            <Avatar size="small" src={CONFIGS[network][chain].icon} />
            <span>{CONFIGS[network][chain].label}</span>
          </Space>
        </Button>
      </div>
      <div className="dropdown-menu" id="dropdown-wallet" role="menu">
        <div className="dropdown-content">
          {LIST.map((v) => {
            if (chain === v) return false;
            const _chain = CONFIGS[network][v];
            if (!_chain) return false;
            return (
              <div key={`chain${v}`} className="dropdown-item">
                <Button
                  type="dashed"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  onClick={() => handleSwitch(v as CHAINS)}
                >
                  <Space>
                    <Avatar size="small" src={_chain.icon} />
                    <span>{_chain.label}</span>
                  </Space>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChainSwitch;

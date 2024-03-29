import React from "react";
import { MAINNET, TESTNET } from "../../../consts/global";
import { useApp } from "../../../common/hooks/use-app";
import { message } from "antd";

const NetworkSwitch = () => {
  const { network } = useApp();
  const handleSwitchNetwork = () => {
    const targetNetwork = network === TESTNET ? MAINNET : TESTNET;
    message.success(`Network switched. You are on ${targetNetwork}`);
  };
  return (
    <div className="level is-mobile">
      <div className="level-left">
        <div className="level-item">
          Network:&nbsp;
          <span
            className={
              network === TESTNET ? "has-text-danger" : "has-text-info"
            }
          >
            {" "}
            {network}
          </span>
        </div>
      </div>

      <div className="level-right">
        <div className="level-item">
          <button onClick={handleSwitchNetwork} className="button is-small">
            Switch
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkSwitch;

import React, { useState } from "react";
import { useApp } from "../../../../common/hooks/use-app";
import Modal from "../../Modal";
import { CHAINS, CONFIGS, LIST } from "../../../../consts/chains";
import { Avatar, Button, Space } from "antd";

const DisplayCurrentChain = () => {
  const [isActive, setActive] = useState(false);
  const { chain, network, switchChain } = useApp();
  const onActive = () => setActive(!isActive);
  const handleSwitch = async (v: CHAINS) => {
    switchChain(v);
    onActive();
  };
  return (
    <>
      <button
        onClick={onActive}
        className={`button is-small is-white is-rounded`}
        aria-controls="dropdown-wallet"
      >
        <img alt="Forthewin Logo" src={"/logo/FTW_512_512.svg"} width="30px" />
        <img
          width="30px"
          src={CONFIGS[network][chain].icon}
          alt={`${CONFIGS[network][chain].label} icon`}
        />
      </button>
      {isActive && (
        <Modal onClose={() => setActive(false)}>
          <div>
            <h5 className="title is-6 has-text-centered">Chain switch</h5>
            <Space direction="vertical" style={{ width: "100%" }}>
              {LIST.map((v) => {
                if (chain === v) {
                  return false;
                }
                const chainObj = CONFIGS[network][v];
                return (
                  <Button
                    style={{ width: "100%" }}
                    key={`chain${v}`}
                    onClick={() => handleSwitch(v as CHAINS)}
                  >
                    <Space>
                      <Avatar
                        style={{ display: "flex" }}
                        size={20}
                        src={chainObj.icon}
                      />
                      {CONFIGS[network][v].label}
                    </Space>
                  </Button>
                );
              })}
            </Space>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DisplayCurrentChain;

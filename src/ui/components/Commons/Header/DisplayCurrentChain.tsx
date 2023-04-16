import React, { useState } from "react";
import { useApp } from "../../../../common/hooks/use-app";
import Modal from "../../Modal";
import { CHAINS, CONFIGS, LIST } from "../../../../consts/chains";

const DisplayCurrentChain = () => {
  const [isActive, setActive] = useState(false);
  const { chain, switchChain } = useApp();
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
          src={CONFIGS[chain].icon}
          alt={`${CONFIGS[chain].label} icon`}
        />
      </button>
      {isActive && (
        <Modal onClose={() => setActive(false)}>
          <div>
            <h5 className="title is-6 has-text-centered">Chain switch</h5>
            <div>
              {LIST.map((v) => {
                if (chain === v) {
                  return false;
                }
                return (
                  <div key={`chain${v}`} className="dropdown-item">
                    <button
                      className={`button is-fullwidth is-small is-rounded is-${CONFIGS[v].color}`}
                      onClick={() => handleSwitch(v as CHAINS)}
                    >
                      Switch to {CONFIGS[v].label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DisplayCurrentChain;

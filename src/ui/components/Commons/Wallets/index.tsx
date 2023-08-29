import React, { useEffect, useState } from "react";
import NEOWalletList from "./NEOWallets/NEOWalletList";
import { ETH_WALLET, NEO_WALLET } from "./consts";
import ETHWallets from "./ETHWallets";
import { LocalStorage } from "../../../../packages/neo/local-storage";
import { useApp } from "../../../../common/hooks/use-app";
import { NEO_CHAIN, NEO_LOGO } from "../../../../consts/global";

const Wallet = ({ isActive }: { isActive: boolean }) => {
  const { chain } = useApp();
  const [walletType, setWalletType] = useState<
    typeof NEO_WALLET | typeof ETH_WALLET
  >(LocalStorage.getWalletSwitch());
  const handleWalletSwitchChange = (val) => {
    LocalStorage.setWalletSwitchType(val);
    setWalletType(val);
  };

  useEffect(() => {
    if (chain === NEO_CHAIN) {
      setWalletType(NEO_WALLET);
    } else {
      setWalletType(ETH_WALLET);
    }
  }, [isActive]);

  return (
    <div className="is-relative">
      <section>
        <aside
          style={{
            height: "200px",
            width: "50px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <ul className="menu">
            <li>
              <button
                onClick={() => handleWalletSwitchChange(NEO_WALLET)}
                style={{ width: "64px", height: "64px" }}
                className={`button is-white is-radiusless ${
                  walletType === NEO_WALLET ? "is-active" : ""
                } `}
              >
                <img alt="NEO wallets" src={NEO_LOGO} />
              </button>
            </li>
            <li>
              <button
                onClick={() => handleWalletSwitchChange(ETH_WALLET)}
                style={{ width: "64px", height: "64px" }}
                className={`button is-white is-radiusless ${
                  walletType === ETH_WALLET ? "is-active" : ""
                } `}
              >
                <img
                  alt="ETH wallets"
                  style={{ width: "40px", height: "40px" }}
                  src={"/symbols/eth.svg"}
                />
              </button>
            </li>
          </ul>
        </aside>
        <div style={{ marginLeft: "64px" }} className="p-5">
          {walletType === NEO_WALLET ? <NEOWalletList /> : <></>}
          {walletType === ETH_WALLET ? <ETHWallets /> : <></>}
        </div>
      </section>
    </div>
  );
};

export default Wallet;

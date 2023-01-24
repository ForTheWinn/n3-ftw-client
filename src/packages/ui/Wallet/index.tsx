import React, { useState } from "react";
import NEOWalletList from "./NEOWallets/NEOWalletList";
import { ETH_WALLET, NEO_WALLET } from "./consts";
import ETHWallets from "./ETHWallets";

const Wallet = () => {
  const [walletType, setWalletType] = useState<
    typeof NEO_WALLET | typeof ETH_WALLET
  >(NEO_WALLET);
  return (
    <div className="is-relative">
      <section>
        <aside
          style={{
            height: "200px",
            width: "50px",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <ul className="menu">
            <li>
              <button
                onClick={() => setWalletType(NEO_WALLET)}
                style={{ width: "64px", height: "64px" }}
                className={`button is-white is-radiusless ${
                  walletType === NEO_WALLET ? "is-active" : ""
                } `}
              >
                <img alt="NEO wallets" src={"/symbols/neo.svg"} />
              </button>
            </li>
            <li>
              <button
                onClick={() => setWalletType(ETH_WALLET)}
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

import React, {useState} from "react";
import NEOWalletList from "./NEOWallets/NEOWalletList";
import {useWallet} from "../../provider";
import {ETH_WALLET, NEO_WALLET} from "./consts";
import ETHWallets from "./ETHWallets";

const Wallet = () => {
  const { connectedWallet } = useWallet();
  const [walletType, setWalletType] = useState<
    typeof NEO_WALLET | typeof ETH_WALLET
  >(NEO_WALLET);
  return (
    <div className="is-relative">
      {/*<header className="level is-mobile p-3 is-marginless">*/}
      {/*  <div className="level-left">*/}
      {/*    <div className="level-item">*/}
      {/*      <WalletDropdown />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  {connectedWallet && (*/}
      {/*    <div className="level-right">*/}
      {/*      <div className="level-item">*/}
      {/*        <small>*/}
      {/*          {utils.truncateAddress(connectedWallet.account.address)}*/}
      {/*        </small>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</header>*/}
      {/*<hr className="m-0" />*/}
      <section>
        <aside
          style={{
            height: "200px",
            width: "50px",
            position: "fixed",
            top: 0,
            left: 0,
            // padding-top: 40px;
            // background-color: lightblue;
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
                <img src={"/symbols/neo.svg"} />
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
                  style={{ width: "40px", height: "40px" }}
                  src={"/symbols/eth.svg"}
                />
              </button>
            </li>
          </ul>
        </aside>
        <div
          style={{ marginLeft: "64px" }}
          className="p-5"
        >
          {walletType === NEO_WALLET ? <NEOWalletList /> : <></>}
          {walletType === ETH_WALLET ? <ETHWallets /> : <></>}
        </div>
      </section>

      {/*<div*/}
      {/*  className="p-5"*/}
      {/*  style={{ position: "absolute", bottom: "40px", width: "100%" }}*/}
      {/*>*/}
      {/*  <NetworkSwitch2 />*/}
      {/*</div>*/}
    </div>
  );
};

export default Wallet;

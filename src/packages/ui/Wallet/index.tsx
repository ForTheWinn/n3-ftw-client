import React from "react";
import { utils } from "../../neo";
import WalletDropdown from "./WalletDropdown";
import WalletList from "./WalletList";
import AssetCard from "./AssetCard";
import { useWallet } from "../../provider";
import NetworkSwitch2 from "../../../ui/components/NetworkSwitch2";
import Modal from "../../../ui/components/Modal";

const Wallet = () => {
  const { connectedWallet } = useWallet();
  return (
    <>
      <header className="level is-mobile p-3 is-marginless">
        <div className="level-left">
          <div className="level-item">
            <WalletDropdown />
          </div>
        </div>
        {connectedWallet && (
          <div className="level-right">
            <div className="level-item">
              <small>
                {utils.truncateAddress(connectedWallet.account.address)}
              </small>
            </div>
          </div>
        )}
      </header>
      <hr className="m-0" />
      <section className="p-5">
        {connectedWallet ? <></> : <WalletList />}
      </section>

      {/*<div*/}
      {/*  className="p-5"*/}
      {/*  style={{ position: "absolute", bottom: "40px", width: "100%" }}*/}
      {/*>*/}
      {/*  <NetworkSwitch2 />*/}
      {/*</div>*/}
    </>
  );
};

export default Wallet;

import React, { useState } from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { getWalletIcon } from "./helpers";
import { IWalletType } from "../../../../../packages/neo/wallets/interfaces";
import Modal from "../../../Modal";
import DisplayConnectedWallet from "./DisplayConnectedWallet";
import { useApp } from "../../../../../common/hooks/use-app";

const NEOWalletList = () => {
  const { network } = useApp();
  const [neonWalletConnecting, setNeonWalletConnecting] = useState(false);
  const { connectWallet, list, connectedWallet, disConnectWallet } =
    useNeoWallets();

  const onWalletConnect = async (walletType: IWalletType) => {
    connectWallet(network, walletType);
  };

  return (
    <>
      <h1 className="title is-6">NEO wallets</h1>

      {connectedWallet ? (
        <DisplayConnectedWallet
          connectedWallet={connectedWallet}
          disConnectWallet={disConnectWallet}
        />
      ) : (
        <>
          {list.map((_wallet) => {
            return (
              <div key={_wallet.key} className="mb-1">
                <button
                  style={{ justifyContent: "flex-start" }}
                  className="button is-fullwidth"
                  onClick={() => onWalletConnect(_wallet.key)}
                >
                  <span className="panel-icon">
                    <img
                      alt={`${_wallet.label} logo`}
                      src={getWalletIcon(_wallet.key)}
                    />
                  </span>
                  {_wallet.label}
                </button>
              </div>
            );
          })}

          {neonWalletConnecting && (
            <Modal onClose={() => setNeonWalletConnecting(false)}>
              <div className="box">
                <figure className="image">
                  <img alt="Neon wallet logo" src={"/icon/neon.svg"} />
                </figure>
                <p>Check your neon wallet</p>
              </div>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default NEOWalletList;
function useWapp(): { network: any } {
  throw new Error("Function not implemented.");
}

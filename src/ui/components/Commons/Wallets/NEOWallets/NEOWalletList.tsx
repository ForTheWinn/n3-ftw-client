import React, { useState } from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { getWalletIcon } from "./helpers";
import { IWalletType } from "../../../../../packages/neo/wallets/interfaces";
import Modal from "../../../Modal";
import DisplayConnectedWallet from "./DisplayConnectedWallet";
import { useApp } from "../../../../../common/hooks/use-app";
import { Avatar, Button, Space } from "antd";

const NEOWalletList = () => {
  const { network, toggleWalletSidebar } = useApp();
  const [neonWalletConnecting, setNeonWalletConnecting] = useState(false);
  const { connectWallet, list, connectedWallet, disConnectWallet } =
    useNeoWallets();

  const onWalletConnect = async (walletType: IWalletType) => {
    connectWallet(network, walletType, toggleWalletSidebar);
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
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          {list.map((_wallet) => {
            return (
              <Button
                key={_wallet.key}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
                onClick={() => onWalletConnect(_wallet.key)}
              >
                <Space>
                  <Avatar
                    style={{ display: "flex" }}
                    size="small"
                    alt={`${_wallet.label} logo`}
                    src={getWalletIcon(_wallet.key)}
                  />
                  {_wallet.label}
                </Space>
              </Button>
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
        </Space>
      )}
    </>
  );
};

export default NEOWalletList;
function useWapp(): { network: any } {
  throw new Error("Function not implemented.");
}

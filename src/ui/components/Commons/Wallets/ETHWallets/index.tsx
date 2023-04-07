import React from "react";
import { getWalletIcon } from "./helpers";
import DisplayConnectedWallet from "./DisplayConnectedWallet";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import toast from "react-hot-toast";
import { useApp } from "../../../../../common/hooks/use-app";
import { WALLET_CONNECTED, WENT_WRONG } from "../../../../../consts/messages";

const ETHWallets = () => {
  const { toggleWalletSidebar } = useApp();
  const { address, connector, isConnected } = useAccount();
  const {
    connectAsync,
    connectors,
    error,
    isLoading,
    pendingConnector
  } = useConnect();

  const { disconnect } = useDisconnect();
  console.log(connector);
  console.log(error);
  console.log(isLoading);
  console.log(pendingConnector);
  const onConnect = async (connector) => {
    console.log(connector)
    try {
      const res = await connectAsync({connector});
      console.log(res);
      // toggleWalletSidebar();
      toast.success(WALLET_CONNECTED);
    } catch (e: any) {
      toast.error(e.message ? e.meesage : WENT_WRONG);
    }
  };

  return (
    <div>
      <h1 className="title is-6">ETH wallets</h1>
      {isConnected && address && connector ? (
        <DisplayConnectedWallet
          account={address}
          connectorId={connector.id}
          disConnectWallet={disconnect}
        />
      ) : (
        <>
          {connectors.map((connector) => {
            return (
              <div key={connector.id} className="mb-1">
                <button
                  className="button is-fullwidth"
                  onClick={() => onConnect(connector)}
                >
                  <span className="panel-icon">
                    <img
                      alt={`${connector.name} logo`}
                      src={getWalletIcon(connector.id)}
                    />
                  </span>
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    " (connecting)"}
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ETHWallets;

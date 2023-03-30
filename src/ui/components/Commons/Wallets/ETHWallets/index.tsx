import React from "react";
import { getWalletIcon } from "./helpers";
import DisplayConnectedWallet from "./DisplayConnectedWallet";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const ETHWallets = () => {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { disconnect } = useDisconnect();

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
            console.log(connector.id);
            return (
              <div key={connector.id} className="mb-1">
                <button
                  className="button is-fullwidth"
                  onClick={() => connect({ connector })}
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

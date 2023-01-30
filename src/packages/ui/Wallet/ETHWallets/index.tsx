import React from "react";
import { ETH_WALLET_LIST } from "../../../web3/consts";
import { getWalletIcon } from "./helpers";
import { useWallet } from "../../../provider";
import { ETHWalletAPI } from "../../../web3";
import { useWeb3React } from "@web3-react/core";
import DisplayConnectedWallet from "./DisplayConnectedWallet";
import { getKey } from "../../../web3/utils";

const ETHWallets = (props) => {
  const { connectETHWallet } = useWallet();
  const {
    connector,
    account,
    accounts,
    isActive,
    isActivating,
    provider,
    hooks,
  } = useWeb3React();
  const walletKey = getKey(connector);
  
  return (
    <div>
      <h1 className="title is-6">ETH wallets</h1>
      {account && walletKey ? (
        <DisplayConnectedWallet
          account={account}
          walletKey={walletKey}
          disConnectWallet={() => {
	          if (connector?.deactivate) {
		          void connector.deactivate()
	          } else {
		          void connector.resetState()
	          }
          }}
        />
      ) : (
        <>
          {ETH_WALLET_LIST.map((_wallet) => {
            return (
              <div key={_wallet.key} className="mb-1">
                <button
                  className="button is-fullwidth"
                  onClick={() => ETHWalletAPI.connect(_wallet.key)}
                >
                  <span className="panel-icon">
                    <img
                      alt={`${_wallet.key} logo`}
                      src={getWalletIcon(_wallet.key)}
                    />
                  </span>
                  {_wallet.label}
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

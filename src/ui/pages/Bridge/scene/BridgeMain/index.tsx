import React, { useState } from "react";

import BridgeInputs from "./Inputs";
import { BRIDGE_TRANSFERS_PATH } from "../../../../../consts/neoRoutes";
import SwapButton from "../../../Swap/components/SwapButton";
import { useBridgeSwap } from "./context";
import ChainSelector from "./ChainSelector";
import NEOActionModal from "./NEOActionModal";
import EVMActionModal from "./EVMActionModal";
import Level from "../../../../components/Level";
import { Link } from "react-router-dom";
import WalletInput from "./WalletInput";
import BridgeDetails from "./BridgeDetails";

const BridgeSwap = () => {
  const {
    chain,
    network,
    token,
    amount,
    balance,
    isActionModaActive,
    originChain,
    destChain,
    receiver,
    connectedNeoWallet,
    connectedAddress,
    setReceiver,
    setAmount,
    openBridgeTokenList,
    toggleWalletSidebar,
    setActionModalActive,
    onAfterBridgeCompleted
  } = useBridgeSwap();

  const onBridge = async () => {
    setActionModalActive(true);
  };

  let evmChainId;
  if (
    originChain &&
    originChain.chainId !== 888 &&
    originChain.chainId !== 889
  ) {
    evmChainId = originChain.chainId;
  }
  if (destChain && destChain.chainId !== 888 && destChain.chainId !== 889) {
    evmChainId = destChain.chainId;
  }
  return (
    <>
      <div className="box is-shadowless mb-1">
        <Level
          left={<h1 className="title is-5 is-marginless">Brdige</h1>}
          right={
            evmChainId ? (
              <Link
                className="button is-small is-white"
                to={`${BRIDGE_TRANSFERS_PATH}/${evmChainId}`}
              >
                History
              </Link>
            ) : (
              <></>
            )
          }
        />
      </div>

      <div className="is-relative">
        <ChainSelector />
        <BridgeInputs
          token={token}
          amount={amount}
          balance={balance}
          onAmountChange={setAmount}
          openBridgeTokenList={openBridgeTokenList}
        />
        {destChain && (
          <WalletInput
            chain={destChain}
            value={receiver}
            onChange={setReceiver}
          />
        )}

        {originChain &&
          destChain &&
          token &&(
            <BridgeDetails
              originChain={originChain}
              destChain={destChain}
              network={network}
              token={token}
            />
          )}

        <SwapButton
          label={"Bridge"}
          isLoading={false}
          isWalletConnected={!!connectedAddress}
          isActive={destChain && !!token && !!amount && receiver.isValid}
          onClick={connectedAddress ? onBridge : toggleWalletSidebar}
        />
      </div>

      {isActionModaActive &&
        originChain &&
        // connectedNeoWallet &&
        token &&
        amount &&
        connectedAddress &&
        destChain && (
          <>
            {(originChain.chainId === 888 || originChain.chainId === 889) &&
            connectedNeoWallet ? (
              <NEOActionModal
                chain={chain}
                destChain={destChain}
                network={network}
                token={token}
                amount={amount}
                receiver={receiver}
                connectedNeoWallet={connectedNeoWallet}
                onSuccess={onAfterBridgeCompleted}
                onCancel={() => setActionModalActive(false)}
              />
            ) : (
              <EVMActionModal
                chain={chain}
                originChain={originChain}
                destChain={destChain}
                network={network}
                token={token}
                amount={amount}
                receiver={receiver}
                address={connectedAddress}
                onSuccess={onAfterBridgeCompleted}
                onCancel={() => setActionModalActive(false)}
              />
            )}
          </>
        )}
    </>
  );
};

export default BridgeSwap;

import React from "react";
import BridgeInputs from "./Inputs";
import { BRIDGE_TRANSFERS_PATH } from "../../../../../consts/routes";
import SwapButton from "../../../Swap/components/SwapButton";
import { useBridgeSwap } from "./context";
import ChainSelector from "./ChainSelector";
import NEOActionModal from "./NEOActionModal";
import EVMActionModal from "./EVMBridgeActionModal";
import Level from "../../../../components/Level";
import { Link } from "react-router-dom";
import WalletInput from "./WalletInput";
import BridgeDetails from "./BridgeDetails";
import {
  NEO_MAINNET_CHAIN_ID,
  NEO_TESTNET_CHAIN_ID,
} from "../../../../../consts/global";

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
    fee,
    setReceiver,
    setAmount,
    openBridgeTokenList,
    toggleWalletSidebar,
    setActionModalActive,
    onAfterBridgeCompleted,
  } = useBridgeSwap();

  const onBridge = async () => {
    setActionModalActive(true);
  };

  let evmChainId;
  if (
    originChain &&
    originChain.chainId !== NEO_MAINNET_CHAIN_ID &&
    originChain.chainId !== NEO_TESTNET_CHAIN_ID
  ) {
    evmChainId = originChain.chainId;
  }
  if (
    destChain &&
    destChain.chainId !== NEO_MAINNET_CHAIN_ID &&
    destChain.chainId !== NEO_TESTNET_CHAIN_ID
  ) {
    evmChainId = destChain.chainId;
  }
  return (
    <>
      <div className="box is-shadowless mb-1">
        <Level
          isMobile
          left={<h1 className="title is-5 is-marginless">Bridge</h1>}
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
            network={network}
            value={receiver}
            onChange={setReceiver}
          />
        )}

        {originChain && destChain && token && fee && (
          <BridgeDetails
            originChain={originChain}
            destChain={destChain}
            token={token}
            fee={fee}
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
        token &&
        amount &&
        connectedAddress &&
        destChain &&
        fee && (
          <>
            {(originChain.chainId === NEO_MAINNET_CHAIN_ID ||
              originChain.chainId === NEO_TESTNET_CHAIN_ID) &&
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
                fee={fee}
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

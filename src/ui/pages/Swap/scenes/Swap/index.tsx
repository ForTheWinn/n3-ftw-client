import React, { useState } from "react";
import SwapInputs from "./SwapInputs";
import SwapDetails from "./components/SwapDetails/SwapDetails";
import SwapButton from "../../components/SwapButton";
import SwapNav from "./components/SwapNav";

import { useSwap } from "../SwapContext";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import PriceComparison from "./components/PriceComparison";
import NeoActionModal from "../../components/Actions/NEOActionModal";
import { NEO_CHAIN } from "../../../../../consts/global";
import EVMSwapActionModal from "../../components/Actions/EVMSwapActionModal";

const SwapMain = () => {
  const {
    chain,
    network,
    tokenA,
    tokenB,
    reserves,
    balances,
    amountA,
    amountB,
    isAmountALoading,
    isAmountBLoading,
    swapInput,
    slippage,
    noLiquidity,
    priceImpact,
    hasEstimatedError,
    hasReservesError,
    onAfterSwapCompleted,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
    onInputSwitch,
    toggleWalletSidebar,
  } = useSwap();

  const { address, isConnected, client } = useWalletRouter(chain);

  const [method, setMethod] = useState<"swap" | "provide" | undefined>();

  const onSwap = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput && address) {
      setMethod("swap");
    }
  };

  const onSuccess = () => {
    onAfterSwapCompleted();
    //need to reset invoke modal.
    setMethod(undefined);
  };

  const onCancel = () => {
    setMethod(undefined);
  };
  return (
    <>
      <SwapNav
        chain={chain}
        network={network}
        search={
          tokenA && tokenB
            ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
            : undefined
        }
        onSettingClick={() => setSettingsModalActive(true)}
      />

      <SwapInputs
        reserves={reserves}
        tokenA={tokenA}
        tokenB={tokenB}
        amountA={amountA}
        amountB={amountB}
        balances={balances}
        swapInput={swapInput}
        isAmountALoading={isAmountALoading}
        isAmountBLoading={isAmountBLoading}
        noLiquidity={noLiquidity}
        priceImpact={priceImpact}
        hasEstimatedError={hasEstimatedError}
        hasReservesError={hasReservesError}
        onSwitch={onInputSwitch}
        onAssetChange={setAssetChangeModalActive}
        setSwapInputChange={onSwapInputChange}
      />

      {tokenA && tokenB && reserves && amountA && amountB ? (
        <>
          <SwapDetails
            tokenA={tokenA}
            tokenB={tokenB}
            amountA={amountA}
            amountB={amountB}
            priceImpact={priceImpact}
            slippage={slippage}
          />

          <PriceComparison
            chain={chain}
            network={network}
            tokenA={tokenA}
            tokenB={tokenB}
            amountIn={amountA}
          />
        </>
      ) : (
        <></>
      )}

      <SwapButton
        label="Swap"
        isLoading={false}
        isActive={!!amountA && !!amountB && !noLiquidity}
        isWalletConnected={isConnected}
        onClick={isConnected ? onSwap : toggleWalletSidebar}
      />

      {method && tokenA && tokenB && address && amountA && amountB && (
        <>
          {chain === NEO_CHAIN ? (
            <NeoActionModal
              connectedWallet={client}
              chain={chain}
              network={network}
              method={method}
              tokenA={tokenA}
              tokenB={tokenB}
              amountA={amountA}
              amountB={amountB}
              isReverse={swapInput && swapInput.type === "B" ? true : false}
              slippage={slippage}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          ) : (
            <EVMSwapActionModal
              chain={chain}
              network={network}
              address={address}
              tokenA={tokenA}
              tokenB={tokenB}
              amountA={amountA}
              amountB={amountB}
              slippage={slippage}
              isReverse={swapInput && swapInput.type === "B" ? true : false}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          )}
        </>
      )}
    </>
  );
};

export default SwapMain;

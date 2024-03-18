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
import NativeTokenSwapInfo from "./components/NativeTokenSwapInfo";
import NativeTokenSwapRoutes from "./components/NativeTokenSwapRoutes";
import { useApp } from "../../../../../common/hooks/use-app";
import NoPairMessage from "./components/NoPairMessage";

const SwapMain = () => {
  const {
    type,
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
    isUnWrapping,
    isWrapping,
    isSwapWithWrapping,
    isSwapWithUnWrapping,
    notEnoughBalanceA,
    prices,
    onAfterSwapCompleted,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
    onInputSwitch,
  } = useSwap();
  const { toggleWalletSidebar } = useApp();

  const { address, isConnected, client } = useWalletRouter(chain);

  const [isActionModalActive, setActionModalActive] = useState(false);

  const onSwap = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput && address) {
      setActionModalActive(true);
    }
  };

  const onSuccess = () => {
    onAfterSwapCompleted();
    //need to reset invoke modal.
    setActionModalActive(false);
  };

  const onCancel = () => {
    setActionModalActive(false);
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
        notEnoughBalance={notEnoughBalanceA}
        prices={prices}
        onSwitch={onInputSwitch}
        onAssetChange={setAssetChangeModalActive}
        setSwapInputChange={onSwapInputChange}
      />

      {tokenA && tokenB && reserves && amountA && amountB ? (
        <>
          {isUnWrapping || isWrapping ? (
            <NativeTokenSwapInfo
              isUnWrapping={isUnWrapping}
              tokenA={tokenA}
              tokenB={tokenB}
            />
          ) : (
            <SwapDetails
              tokenA={tokenA}
              tokenB={tokenB}
              amountA={amountA}
              amountB={amountB}
              priceImpact={priceImpact}
              slippage={slippage}
            />
          )}
          {isSwapWithUnWrapping || isSwapWithWrapping ? (
            <NativeTokenSwapRoutes
              chain={chain}
              network={network}
              isSwapWithWrapping={isSwapWithWrapping}
              isSwapWithUnWrapping={isSwapWithUnWrapping}
              tokenA={tokenA}
              tokenB={tokenB}
            />
          ) : (
            <PriceComparison
              chain={chain}
              network={network}
              tokenA={tokenA}
              tokenB={tokenB}
              amountIn={amountA}
            />
          )}
        </>
      ) : (
        <></>
      )}
      {noLiquidity && !isUnWrapping && !isWrapping && <NoPairMessage />}

      <SwapButton
        label="Swap"
        isLoading={false}
        isActive={
          !!amountA &&
          !!amountB &&
          (!noLiquidity || isUnWrapping || isWrapping) &&
          notEnoughBalanceA !== undefined &&
          notEnoughBalanceA == false
        }
        isWalletConnected={isConnected}
        onClick={isConnected ? onSwap : toggleWalletSidebar}
      />

      {isActionModalActive &&
        tokenA &&
        tokenB &&
        address &&
        amountA &&
        amountB && (
          <>
            {chain === NEO_CHAIN ? (
              <NeoActionModal
                isWrapping={isWrapping}
                isUnWrapping={isUnWrapping}
                isSwapWithWrapping={isSwapWithWrapping}
                isSwapWithUnWrapping={isSwapWithUnWrapping}
                connectedWallet={client}
                chain={chain}
                network={network}
                type={type}
                tokenA={tokenA}
                tokenB={tokenB}
                amountA={amountA}
                amountB={amountB}
                isReverse={swapInput && swapInput.type === "B" ? true : false}
                slippage={slippage}
                lockUntil={undefined}
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
                isWrapping={isWrapping}
                isUnWrapping={isUnWrapping}
                isSwapWithWrapping={isSwapWithWrapping}
                isSwapWithUnWrapping={isSwapWithUnWrapping}
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

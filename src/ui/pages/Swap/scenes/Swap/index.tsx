import React, { useState } from "react";
import ProvideLPInfo from "../../components/ProvideLPInfo";
import SwapInputs from "./SwapInputs";
import SwapDetails from "./components/SwapDetails/SwapDetails";
import SwapButton from "../../components/SwapButton";
import SwapNav from "./components/SwapNav";

import ActionModal from "../../components/ActionModal";
import { NEO_ROUTES } from "../../../../../consts";
import { useSwap } from "../SwapContext";
import { Divider } from "antd";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../consts/neoRoutes";

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
    inputError,
    onAfterSwapCompleted,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
    onInputSwitch,
    toggleWalletSidebar
  } = useSwap();

  const { address, isConnected } = useWalletRouter(chain);

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
        search={
          tokenA && tokenB
            ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
            : undefined
        }
        onSettingClick={() => setSettingsModalActive(true)}
      />

      <Divider />

      {noLiquidity && tokenA && tokenB ? (
        <ProvideLPInfo
          path={{
            pathname: `${SWAP_PATH_LIQUIDITY_ADD}`,
            search:
              tokenA && tokenB
                ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
                : ""
          }}
        />
      ) : (
        <></>
      )}

      <SwapInputs
        tokenA={tokenA}
        tokenB={tokenB}
        amountA={amountA}
        amountB={amountB}
        balances={balances}
        swapInput={swapInput}
        isAmountALoading={isAmountALoading}
        isAmountBLoading={isAmountBLoading}
        noLiquidity={noLiquidity}
        inputError={inputError}
        onSwitch={onInputSwitch}
        onAssetChange={setAssetChangeModalActive}
        setSwapInputChange={onSwapInputChange}
      />

      {tokenA && tokenB && reserves && amountA && amountB && reserves ? (
        <SwapDetails
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={amountA}
          amountB={amountB}
          priceImpact={priceImpact}
          slippage={slippage}
        />
      ) : (
        <></>
      )}

      <Divider />

      <SwapButton
        label="Swap"
        isLoading={false}
        isActive={!!amountA && !!amountB}
        isWalletConnected={isConnected}
        onClick={isConnected ? onSwap : toggleWalletSidebar}
      />

      {method && tokenA && tokenB && address && amountA && amountB && method ? (
        <ActionModal
          chain={chain}
          network={network}
          address={address}
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={amountA}
          amountB={amountB}
          slippage={slippage}
          method={method}
          isReverse={swapInput && swapInput.type === "B" ? true : false}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default SwapMain;

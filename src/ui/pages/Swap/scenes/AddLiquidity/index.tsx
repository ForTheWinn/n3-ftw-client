import React, { useState } from "react";
import { useSwap } from "../SwapContext";

import LPInputs from "./Inputs";
import SwapButton from "../../components/SwapButton";
import Nav from "./components/Nav";
import ProvideLPInfo from "../../components/ProvideLPInfo";
import ActionModal from "../../components/ActionModal";

import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { Divider } from "antd";
import { SWAP_PATH } from "../../../../../consts/neoRoutes";

const Liquidity = () => {
  const {
    chain,
    network,
    tokenA,
    tokenB,
    balances,
    amountA,
    amountB,
    swapInput,
    slippage,
    noLiquidity,
    onAfterSwapCompleted,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
    toggleWalletSidebar
  } = useSwap();

  const { address, isConnected } = useWalletRouter(chain);

  const [method, setMethod] = useState<"swap" | "provide" | undefined>();

  const onProvide = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput && address) {
      setMethod("provide");
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

  const toMain = {
    pathname: `${SWAP_PATH}`,
    search:
      tokenA && tokenB ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}` : ""
  };

  const title = noLiquidity ? "Create a new pool" : "Provide liquidity";

  return (
    <>
      <Nav
        path={toMain}
        title={title}
        onSettingClick={() => setSettingsModalActive(true)}
      />
      <Divider />

      {noLiquidity && <ProvideLPInfo />}

      <div className="is-relative">
        <div className="pb-2">
          <LPInputs
            tokenA={tokenA}
            tokenB={tokenB}
            amountA={amountA}
            amountB={amountB}
            swapInput={swapInput}
            setSwapInputChange={onSwapInputChange}
            onAssetChange={setAssetChangeModalActive}
            balances={balances}
          />
        </div>

        <Divider />

        <SwapButton
          label={"Add Liquidity"}
          isLoading={false}
          isWalletConnected={isConnected}
          isActive={!!tokenA && !!tokenB && !!amountA && !!amountB}
          onClick={isConnected ? onProvide : toggleWalletSidebar}
        />
      </div>

      {method && tokenA && tokenB && address && amountA && amountB && (
        <ActionModal
          chain={chain}
          network={network}
          method={method}
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={amountA}
          amountB={amountB}
          isReverse={false}
          address={address}
          slippage={slippage}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      )}
    </>
  );
};

export default Liquidity;

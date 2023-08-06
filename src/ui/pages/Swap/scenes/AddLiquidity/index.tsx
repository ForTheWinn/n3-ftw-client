import React, { useState } from "react";
import { useSwap } from "../SwapContext";

import LPInputs from "./Inputs";
import SwapButton from "../../components/SwapButton";
import Nav from "./components/Nav";

import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { SWAP_PATH } from "../../../../../consts/routes";
import { NEO_CHAIN } from "../../../../../consts/global";
import NeoActionModal from "../../components/Actions/NEOActionModal";
import EVMLiquidityActionModal from "../../components/Actions/EVMLiquidityActionModal";

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
    toggleWalletSidebar,
  } = useSwap();

  const { address, isConnected, client } = useWalletRouter(chain);

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
      tokenA && tokenB ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}` : "",
  };

  const title = noLiquidity ? "Create a new pool" : "Provide liquidity";

  return (
    <>
      <Nav
        path={toMain}
        title={title}
        onSettingClick={() => setSettingsModalActive(true)}
      />

      <div className="is-relative">
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

        <SwapButton
          label={"Add Liquidity"}
          isLoading={false}
          isWalletConnected={isConnected}
          isActive={!!tokenA && !!tokenB && !!amountA && !!amountB}
          onClick={isConnected ? onProvide : toggleWalletSidebar}
        />
      </div>

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
              isReverse={false}
              slippage={slippage}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          ) : (
            <EVMLiquidityActionModal
              chain={chain}
              network={network}
              tokenA={tokenA}
              tokenB={tokenB}
              amountA={amountA}
              amountB={amountB}
              address={address}
              slippage={slippage}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          )}
        </>
      )}
    </>
  );
};

export default Liquidity;

import React, { useState } from "react";
import { useSwap } from "../SwapContext";

import LPInputs from "./Inputs";
import SwapButton from "../../components/SwapButton";
import Nav from "./components/Nav";

import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { SWAP_PATH, SWAP_PATH_LIQUIDITY_REMOVE } from "../../../../../consts/routes";
import { NEO_CHAIN } from "../../../../../consts/global";
import NeoActionModal from "../../components/Actions/NEOActionModal";
import EVMLiquidityActionModal from "../../components/Actions/EVMLiquidityActionModal";
import { useApp } from "../../../../../common/hooks/use-app";
import NativeTokenInfo from "./components/NativeTokenInfo";
import TimeLockInput from "./components/TimeLockInput";
import { useHistory } from "react-router-dom";

const Liquidity = () => {
  const {
    type,
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
    notEnoughBalanceA,
    notEnoughBalanceB,
    onAfterSwapCompleted,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
  } = useSwap();

  const { toggleWalletSidebar } = useApp();
  const history = useHistory();

  const { address, isConnected, client } = useWalletRouter(chain);

  const [isActionModalActive, setActionModalActive] = useState(false);
  const [lockUntil, setLockUntil] = useState<Date | undefined>();

  const onProvide = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput && address) {
      setActionModalActive(true);
    }
  };

  const onSuccess = () => {
    onAfterSwapCompleted();
    setActionModalActive(false);
    history.push(SWAP_PATH_LIQUIDITY_REMOVE);
  };

  const onCancel = () => {
    setActionModalActive(false);
  };

  const toMain = {
    pathname: `${SWAP_PATH}`,
    search:
      tokenA && tokenB ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}` : "",
  };

  const title = noLiquidity ? "Create a new pool" : "Add liquidity";
  const hasNativeToken = tokenA?.isNative || tokenB?.isNative;

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
          notEnoughBalanceA={notEnoughBalanceA}
          notEnoughBalanceB={notEnoughBalanceB}
        />

        {hasNativeToken && tokenA && tokenB && (
          <NativeTokenInfo tokenA={tokenA} tokenB={tokenB} />
        )}

        {chain === NEO_CHAIN && (
          <TimeLockInput lockUntil={lockUntil} setLockUntil={setLockUntil} />
        )}

        <SwapButton
          label={"Add Liquidity"}
          isLoading={false}
          isWalletConnected={isConnected}
          isActive={
            !!tokenA &&
            !!tokenB &&
            !!amountA &&
            !!amountB &&
            notEnoughBalanceA !== undefined &&
            notEnoughBalanceA == false &&
            notEnoughBalanceB !== undefined &&
            notEnoughBalanceB == false
          }
          onClick={isConnected ? onProvide : toggleWalletSidebar}
        />
      </div>

      {isActionModalActive &&
        tokenA &&
        tokenB &&
        address &&
        amountA &&
        amountB && (
          <>
            {chain === NEO_CHAIN ? (
              <NeoActionModal
                isUnWrapping={false}
                isWrapping={false}
                isSwapWithUnWrapping={false}
                isSwapWithWrapping={false}
                connectedWallet={client}
                chain={chain}
                network={network}
                type={type}
                tokenA={tokenA}
                tokenB={tokenB}
                amountA={amountA}
                amountB={amountB}
                isReverse={false}
                slippage={slippage}
                lockUntil={lockUntil}
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

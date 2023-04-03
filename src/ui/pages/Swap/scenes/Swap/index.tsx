import React, {  useState } from "react";
import { useApp } from "../../../../../common/hooks/use-app";
import { useAccount } from "wagmi";
import ProvideLPInfo from "../../components/ProvideLPInfo";
import SwapInputs from "./SwapInputs";
import SwapDetails from "./components/SwapDetails/SwapDetails";
import SwapButton from "../../components/SwapButton";
import SwapNav from "./components/SwapNav";

import ActionModal from "../../components/ActionModal";
import SwapSettings from "../../components/Settings";
import { NEO_ROUTES } from "../../../../../consts";
import { useWallet } from "../../../../../packages/neo/provider";
import {
  ISwapReserves,
  IUserTokenBalances
} from "../../../../../common/routers/swap/interfaces";
import { useSwap } from "../SwapContext";

interface ISwapProps {
  rootPath: string;
}

const SwapMain = ({ rootPath }: ISwapProps) => {
  const {
    chain,
    toggleWalletSidebar,
    network,
    refreshCount,
    increaseRefreshCount
  } = useApp();
  const { connectedWallet } = useWallet();
  const { address, isConnected } = useAccount();

  const {
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
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange
  } = useSwap();

  const [method, setMethod] = useState<"swap" | "provide" | undefined>();

  const onReset = () => {
    console.log(1);
    setAmountA(undefined);
    setAmountB(undefined);
    increaseRefreshCount();
    setMethod(undefined);
  };

  const onSwitch = async () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(undefined);
    setAmountB(undefined);
  };

  const onSwap = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput && address) {
      setMethod("swap");
    }
  };

  let noLiquidity = false;
  let priceImpact = 0;

  if (tokenA && tokenB && reserves) {
    noLiquidity = reserves.shares === "0";
    if (amountA && amountB && reserves) {
      priceImpact = (amountB / parseFloat(reserves.reserveB)) * 100;
    }
    console.log(reserves);
  }

  return (
    <>
      <SwapNav
        rootPath={rootPath}
        search={
          tokenA && tokenB
            ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
            : undefined
        }
        onSettingClick={() => setSettingsModalActive(true)}
      />

      <hr className="is-hidden-mobile" />

      {noLiquidity && tokenA && tokenB ? (
        <ProvideLPInfo
          path={{
            pathname: `${rootPath}${NEO_ROUTES.SWAP_PATH_LIQUIDITY_ADD}`,
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
        setSwapInputChange={onSwapInputChange}
        onSwitch={onSwitch}
        onAssetChange={setAssetChangeModalActive}
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

      {/* {error ? <ReservesFetchError message={error} /> : <></>} */}

      <hr />

      <SwapButton
        label="Swap"
        isLoading={false}
        isActive={!!amountA && !!amountB}
        isWalletConnected={isConnected}
        onClick={isConnected ? onSwap : toggleWalletSidebar}
      />

      {method &&
        tokenA &&
        tokenB &&
        address &&
        amountA &&
        amountB &&
        method && (
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
            connectedWallet={connectedWallet}
            isReverse={swapInput && swapInput.type === "B" ? true : false}
            onClose={onReset}
          />
        )}

      <SwapSettings
        isActive={isSettingsActive}
        onClose={() => setSettingsActive(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
    </>
  );
};

export default SwapMain;

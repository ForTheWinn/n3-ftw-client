import React, { useEffect, useState } from "react";
import { useApp } from "../../../../../common/hooks/use-app";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import queryString from "query-string";

import { DEFAULT_SLIPPAGE } from "../../../../../packages/neo/contracts/ftw/swap/consts";

import AssetListModal from "../../../../components/Commons/TokenList";
import ProvideLPInfo from "../../components/ProvideLPInfo";
import SwapInputs from "./SwapInputs";
import SwapDetails from "./components/SwapDetails/SwapDetails";
import SwapButton from "../../components/SwapButton";
import SwapNav from "./components/SwapNav";
import ReservesFetchError from "./components/Notifications/ReservesFetchError";

import { ISwapInputState, ITokenState } from "./interfaces";

import { useLocation } from "react-router-dom";
import { getTokenByHash } from "./helpers";
import ActionModal from "../../components/ActionModal";
import SwapSettings from "../../components/Settings";
import { NEO_ROUTES } from "../../../../../consts";
import { swapRouter } from "../../../../../common/routers";
import { useWallet } from "../../../../../packages/neo/provider";
import { NEO_CHAIN } from "../../../../../consts/chains";
import {
  ISwapReserves,
  IUserTokenBalances
} from "../../../../../common/routers/swap/interfaces";

interface ISwapProps {
  rootPath: string;
}

const PolygonSwap = ({ rootPath }: ISwapProps) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const {
    chain,
    toggleWalletSidebar,
    network,
    refreshCount,
    increaseRefreshCount
  } = useApp();
  const { connectedWallet } = useWallet();
  const { address, isConnected } = useAccount();

  const [tokenA, setTokenA] = useState<ITokenState | undefined>(
    params.tokenA
      ? getTokenByHash(chain, network, params.tokenA as string)
      : undefined
  );
  const [tokenB, setTokenB] = useState<ITokenState | undefined>(
    params.tokenB
      ? getTokenByHash(chain, network, params.tokenB as string)
      : undefined
  );

  const [reserves, setReserve] = useState<ISwapReserves | undefined>();
  const [balances, setBalances] = useState<IUserTokenBalances | undefined>();

  const [amountA, setAmountA] = useState<number | undefined>();
  const [amountB, setAmountB] = useState<number | undefined>();

  const [swapInput, setSwapInput] = useState<ISwapInputState>();

  const [method, setMethod] = useState<"swap" | "provide" | undefined>();
  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | undefined
  >();

  const [isAmountALoading, setAmountALoading] = useState(false);
  const [isAmountBLoading, setAmountBLoading] = useState(false);

  const [isSettingsActive, setSettingsActive] = useState(false);
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);

  const [error, setError] = useState<any>();

  const onAssetChange = (type: "A" | "B" | undefined) => {
    setAssetChangeModalActive(type);
  };

  const onAssetClick = (token: ITokenState) => {
    if (isAssetChangeModalActive === "A") {
      if (tokenB && tokenB.hash === token.hash) {
        return false;
      }
      setTokenA(token);
    } else {
      if (tokenA && tokenA.hash === token.hash) {
        return false;
      }
      setTokenB(token);
    }
    setAmountB(undefined);
    setAmountA(undefined);
    setAssetChangeModalActive(undefined);
  };

  const onSwapInputChange = (val: ISwapInputState) => {
    if (val.type === "A") {
      setAmountA(val.value);
    } else if (val.type === "B") {
      setAmountB(val.value);
    }
    setSwapInput(val);
  };

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

  useEffect(() => {
    const load = async (_tokenA, _tokenB) => {
      setError(undefined);
      try {
        const res = await await swapRouter.getReserves(
          chain,
          network,
          _tokenA,
          _tokenB
        );
        setReserve(res);

        let _address =
          chain === NEO_CHAIN ? connectedWallet?.account.address : address;

        console.log(_address);
        if (_address) {
          const { amountA, amountB } = await swapRouter.getBalances(
            chain,
            network,
            _address,
            _tokenA.hash,
            _tokenB.hash
          );
          setBalances({
            amountA,
            amountB
          });
        }

        window.history.replaceState(
          null,
          "",
          `/#${location.pathname}?tokenA=${_tokenA.hash}&tokenB=${_tokenB.hash}`
        );
      } catch (e) {
        setError("Failed to fetch reserves.");
        console.log(e);
      }
    };
    if (tokenA && tokenB) {
      load(tokenA, tokenB);
    }
  }, [address, tokenA, tokenB, refreshCount, connectedWallet]);

  useEffect(() => {
    if (tokenA && tokenB && swapInput && swapInput.value !== undefined) {
      const delayDebounceFn = setTimeout(async () => {
        setError(undefined);
        if (swapInput.type === "A") {
          setAmountBLoading(true);
        } else {
          setAmountALoading(true);
        }

        let estimated;

        try {
          if (swapInput.value) {
            const args = {
              tokenA: tokenA.hash,
              tokenB: tokenB.hash,
              amount: ethers.utils
                .parseUnits(
                  swapInput.value.toString(),
                  swapInput.type === "A" ? tokenA.decimals : tokenB.decimals
                )
                .toString(),
              isReverse: swapInput.type === "B"
            };
            estimated = await swapRouter.getEstimate(
              chain,
              network,
              args,
              swapInput.type === "A" ? tokenB.decimals : tokenA.decimals
            );
            console.log(estimated);
          }
        } catch (e: any) {
          setError("Failed to fetch swap estimate. Check your inputs.");
          console.log(e.reason);
        }

        if (swapInput.type === "A") {
          setAmountBLoading(false);
          setAmountB(+estimated);
        } else {
          setAmountALoading(false);
          setAmountA(+estimated);
        }
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [swapInput]);

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
        onSettingClick={() => setSettingsActive(true)}
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
        onAssetChange={onAssetChange}
      />

      {tokenA && tokenB && reserves && amountA && amountB && reserves ? (
        <SwapDetails
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={amountA}
          amountB={amountB}
          priceImpact={priceImpact}
          slippage={slippage}
          setSlippage={setSlippage}
        />
      ) : (
        <></>
      )}

      {error ? <ReservesFetchError message={error} /> : <></>}

      <hr />

      <SwapButton
        label="Swap"
        isLoading={false}
        isActive={!!amountA && !!amountB}
        isWalletConnected={isConnected}
        onClick={isConnected ? onSwap : toggleWalletSidebar}
      />

      {isAssetChangeModalActive && (
        <AssetListModal
          chain={chain}
          network={network}
          activeTokenInput={isAssetChangeModalActive}
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive(undefined)}
        />
      )}

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

export default PolygonSwap;

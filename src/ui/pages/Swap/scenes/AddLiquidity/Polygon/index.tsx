import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";

import { useApp } from "../../../../../../common/hooks/use-app";
import { getTokenByHash } from "../../Swap/helpers";
import {
  getLPEstimate,
} from "../../../../../../packages/polygon/swap";
import { DEFAULT_SLIPPAGE } from "../../../../../../packages/neo/contracts/ftw/swap/consts";

import AssetListModal from "../../../../../components/Commons/TokenList";
import LPInputs from "./Inputs";
import SwapButton from "../../../components/SwapButton";
import Nav from "../components/Nav";
import ProvideLPInfo from "../../../components/ProvideLPInfo";
import ActionModal from "../../../components/ActionModal";
import SwapSettings from "../../../components/Settings";

import { ISwapInputState, ITokenState } from "../../Swap/interfaces";
import {
  ISwapReserves,
  IUserTokenBalances
} from "../../../../../../common/routers/swap/interfaces";
import { useWallet } from "../../../../../../packages/neo/provider";
import { swapRouter } from "../../../../../../common/routers";

interface ILiquidityProps {
  rootPath: string;
}

const Liquidity = ({ rootPath }: ILiquidityProps) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { address, isConnected } = useAccount();
  const { connectedWallet } = useWallet();
  const {
    chain,
    toggleWalletSidebar,
    network,
    refreshCount,
    increaseRefreshCount
  } = useApp();

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

  const [method, setMethod] = useState<"swap" | "provide" | undefined>();
  const [swapInput, setSwapInput] = useState<ISwapInputState>();

  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | ""
  >("");

  const [isSettingsActive, setSettingsActive] = useState(false);
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);

  const [error, setError] = useState<any>();

  const onAssetChange = (type: "A" | "B" | "") => {
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
    setAssetChangeModalActive("");
  };

  const onInputChange = (val: ISwapInputState) => {
    if (val.type === "A") {
      setAmountA(val.value);
      if (tokenA && tokenB && reserves && val.value) {
        const estimated = getLPEstimate(
          val.value,
          tokenA.decimals,
          tokenB.decimals,
          reserves.reserveA,
          reserves.reserveB
        );
        setAmountB(parseFloat(estimated));
      }
    } else if (val.type === "B") {
      setAmountB(val.value);
      if (tokenA && tokenB && reserves && val.value) {
        const estimated = getLPEstimate(
          val.value,
          tokenB.decimals,
          tokenA.decimals,
          reserves.reserveB,
          reserves.reserveA
        );
        setAmountA(parseFloat(estimated));
      }
    }
    setSwapInput(val);
  };

  const onReset = () => {
    setAmountA(undefined);
    setAmountB(undefined);
    increaseRefreshCount();
    setMethod(undefined);
  };

  const onProvide = async () => {
    if (tokenA && tokenB && amountA && amountB && address) {
      setMethod("provide");
    }
  };

  useEffect(() => {
    const load = async (_tokenA: ITokenState, _tokenB: ITokenState) => {
      setError(undefined);
      try {
        const res = await swapRouter.getReserves(
          chain,
          network,
          _tokenA,
          _tokenB
        );

        setReserve(res);

        if (address) {
          const tokenAbalance = await fetchBalance({
            address,
            token: _tokenA.hash as `0x${string}`
          });

          const tokenBbalance = await fetchBalance({
            address,
            token: _tokenB.hash as `0x${string}`
          });

          setBalances({
            amountA: tokenAbalance.formatted,
            amountB: tokenBbalance.formatted
          });

          window.history.replaceState(
            null,
            "",
            `/#${location.pathname}?tokenA=${_tokenA.hash}&tokenB=${_tokenB.hash}`
          );
        }
      } catch (e) {
        setError("Failed to fetch reserves.");
        console.log(e);
      }
    };
    if (tokenA && tokenB) {
      load(tokenA, tokenB);
    }
  }, [address, tokenA, tokenB, refreshCount]);

  let noLiquidity = false;

  if (tokenA && tokenB && reserves) {
    noLiquidity = reserves.shares === "0";
  }

  const toMain = {
    pathname: `${rootPath}`,
    search:
      tokenA && tokenB ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}` : ""
  };

  const title = noLiquidity ? "Create a new pool" : "Provide liquidity";

  return (
    <>
      <Nav
        path={toMain}
        title={title}
        onSettingClick={() => setSettingsActive(true)}
      />
      <hr />

      {noLiquidity && <ProvideLPInfo />}

      <div className="is-relative">
        <div className="pb-2">
          <LPInputs
            tokenA={tokenA}
            tokenB={tokenB}
            amountA={amountA}
            amountB={amountB}
            swapInput={swapInput}
            setSwapInputChange={onInputChange}
            onAssetChange={onAssetChange}
            balances={balances}
          />
        </div>

        <hr />

        <SwapButton
          label={"Add liquidity"}
          isLoading={false}
          isWalletConnected={isConnected}
          isActive={!!tokenA && !!tokenB && !!amountA && !!amountB}
          onClick={isConnected ? onProvide : toggleWalletSidebar}
        />
      </div>

      {isAssetChangeModalActive && (
        <AssetListModal
          chain={chain}
          network={network}
          activeTokenInput={isAssetChangeModalActive}
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive("")}
        />
      )}

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
          connectedWallet={connectedWallet}
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

export default Liquidity;

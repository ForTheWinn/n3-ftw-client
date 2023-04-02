import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { fetchBalance } from "@wagmi/core";

import { useApp } from "../../../../../../common/hooks/use-app";
import { getTokenByHash } from "../../Swap/helpers";
import {
  getLPEstimate,
  getReserves,
  provide
} from "../../../../../../packages/polygon/swap";
import { DEFAULT_SLIPPAGE } from "../../../../../../packages/neo/contracts/ftw/swap/consts";

import AssetListModal from "../../Swap/Polygon/TokenList";
import LPInputs from "./Inputs";
import SwapButton from "../../../components/SwapButton";
import Nav from "../components/Nav";
import ProvideLPInfo from "../../../components/ProvideLPInfo";
import ActionModal from "./ActionModal";
import SwapSettings from "../../../components/Settings";

import {
  IBalancesState,
  IReservesState,
  ISwapInputState,
  ITokenState
} from "../../Swap/interfaces";

interface ILiquidityProps {
  rootPath: string;
}

const Liquidity = ({ rootPath }: ILiquidityProps) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { address, isConnected } = useAccount();
  const { chain, toggleWalletSidebar, network } = useApp();

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

  const [reserves, setReserve] = useState<IReservesState | undefined>();
  const [balances, setBalances] = useState<IBalancesState | undefined>();

  const [amountA, setAmountA] = useState<number | undefined>();
  const [amountB, setAmountB] = useState<number | undefined>();

  const [swapInput, setSwapInput] = useState<ISwapInputState>();

  const [invocationConfig, setInvocationConfig] = useState<
    object | undefined
  >();
  // const [isTokenAApproved, setTokenAApproved] = useState(false);
  // const [isTokenAApprving, setTokenAApproving] = useState(false);
  // const [isTokenBApproved, setTokenBApproved] = useState(false);
  // const [isTokenBApprving, setTokenBApproving] = useState(false);
  // const [isSwapDone, setSwapDone] = useState(false);
  // const [isSwapping, setSwapping] = useState(false);
  // const [hasTokenAApproveError, setTokenAApproveError] = useState(false);
  // const [hasTokenBApproveError, setTokenBApproveError] = useState(false);
  // const [hasSwappingError, setSwappingError] = useState(false);

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
      // if (!val.value) {
      //   setAmountB(undefined);
      // }
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
      // if (!val.value) {
      //   setAmountA(undefined);
      // }
    }
    setSwapInput(val);
  };

  const onReset = () => {
    // setRefresh(refresh + 1);
    // setTokenAApproved(false);
    // setTokenAApproving(false);
    // setTokenBApproved(false);
    // setTokenBApproving(false);
    // setSwapDone(false);
    // setSwapping(false);
    // setTokenAApproveError(false);
    // setTokenBApproveError(false);
    // setSwappingError(false);
    // setTxid(undefined);
    setAmountA(undefined);
    setAmountB(undefined);
  };

  const onProvide = async () => {
    if (tokenA && tokenB && amountA && amountB && address) {
      // TODO: check later
      // if (network.chain && getChainId(chain) !== network.chain.id) {
      //   toast.error(
      //     "Chain doesn't match. Please check your wallet's network setting."
      //   );
      //   return false;
      // }
      const config = await provide(network, [
        tokenA.hash,
        ethers.utils.parseUnits(amountA.toString(), tokenA.decimals).toString(),
        tokenB.hash,
        ethers.utils.parseUnits(amountB.toString(), tokenB.decimals).toString(),
        slippage * 100
      ]);

      setInvocationConfig(config);
    }
  };

  useEffect(() => {
    const load = async (_tokenA: ITokenState, _tokenB: ITokenState) => {
      setError(undefined);
      try {
        const res = await getReserves(network, _tokenA, _tokenB);
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
  }, [address, tokenA, tokenB, refresh]);

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
          network={network}
          activeTokenInput={isAssetChangeModalActive}
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive("")}
        />
      )}

      {invocationConfig && tokenA && tokenB && (
        <ActionModal
          // title="Add Liquidity"
          tokenA={tokenA}
          tokenB={tokenB}
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

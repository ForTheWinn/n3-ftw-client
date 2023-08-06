import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import Decimal from "decimal.js";
import toast from "react-hot-toast";
import { ethers } from "ethers";

import { ISwapInputState, ITokenState } from "../Swap/interfaces";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useApp } from "../../../../../common/hooks/use-app";
import {
  ISwapReserves,
  IUserTokenBalances,
} from "../../../../../common/routers/swap/interfaces";
import { swapRouter } from "../../../../../common/routers";
import { CHAINS } from "../../../../../consts/chains";
import { DEFAULT_SLIPPAGE } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import { INetworkType } from "../../../../../packages/neo/network";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { getTokenByHash } from "../../../../../common/helpers";

import TokenList from "../../../../components/Commons/TokenList";
import SwapSettings from "../../components/Settings";
import ProvideLPInfo from "../../components/ProvideLPInfo";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../consts/routes";

interface ISwapContext {
  chain: CHAINS;
  network: INetworkType;
  tokenA: ITokenState | undefined;
  tokenB: ITokenState | undefined;
  amountA: string | undefined;
  amountB: string | undefined;
  isAmountALoading: boolean;
  isAmountBLoading: boolean;
  swapInput: ISwapInputState | undefined;
  reserves: ISwapReserves | undefined;
  balances: IUserTokenBalances | undefined;
  slippage: number;
  noLiquidity: boolean;
  priceImpact: number;
  hasEstimatedError: boolean;
  hasReservesError: boolean;
  setAssetChangeModalActive: (v: "A" | "B" | undefined) => void;
  setSettingsModalActive: (v: boolean) => void;
  onSwapInputChange: (v: ISwapInputState) => void;
  onInputSwitch: () => void;
  onAfterSwapCompleted: () => void;
  toggleWalletSidebar: () => void;
}

export const SwapContext = createContext({} as ISwapContext);

const getEstimatedForSwap = async (
  chain,
  network,
  swapInput,
  tokenA,
  tokenB
) => {
  const args = {
    tokenA: tokenA.hash,
    tokenB: tokenB.hash,
    amount: ethers.utils
      .parseUnits(
        swapInput.value,
        swapInput.type === "A" ? tokenA.decimals : tokenB.decimals
      )
      .toString(),
    isReverse: swapInput.type === "B",
  };

  try {
    const estimated = await swapRouter.getEstimate(chain, network, args);
    if (estimated !== "0") {
      return ethers.utils.formatUnits(
        estimated,
        swapInput.type === "A" ? tokenB.decimals : tokenA.decimals
      );
    }
    return estimated;
  } catch (e: any) {
    console.error(e);
    return null;
  }
};

const getEstimatedForLiquidity = (
  swapInput: ISwapInputState,
  tokenA: ITokenState,
  tokenB: ITokenState,
  reserves: ISwapReserves | undefined
) => {
  if (reserves && swapInput.value && reserves && reserves.shares !== "0") {
    const val = ethers.utils.parseUnits(
      swapInput.value.toString(),
      swapInput.type === "A" ? tokenA.decimals : tokenB.decimals
    );
    const estimated = val
      .mul(swapInput.type === "A" ? reserves.reserveB : reserves.reserveA)
      .div(swapInput.type === "A" ? reserves.reserveA : reserves.reserveB)
      .toString();

    return ethers.utils.formatUnits(
      estimated,
      swapInput.type === "A" ? tokenB.decimals : tokenA.decimals
    );
  }

  return null;
};

export const SwapContextProvider = (props: {
  type: "swap" | "liquidity";
  children: any;
}) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const {
    chain,
    network,
    refreshCount,
    increaseRefreshCount,
    toggleWalletSidebar,
  } = useApp();

  const { address, isConnected, client } = useWalletRouter(chain);

  const [tokenA, setTokenA] = useState<ITokenState | undefined>();
  const [tokenB, setTokenB] = useState<ITokenState | undefined>();

  const [amountA, setAmountA] = useState<string | undefined>();
  const [amountB, setAmountB] = useState<string | undefined>();

  const [isAmountALoading, setAmountALoading] = useState(false);
  const [isAmountBLoading, setAmountBLoading] = useState(false);

  const [swapInput, setSwapInput] = useState<ISwapInputState | undefined>();

  const [reserves, setReserve] = useState<ISwapReserves | undefined>();
  const [balances, setBalances] = useState<IUserTokenBalances | undefined>();

  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);
  const [isSettingsModalActive, setSettingsModalActive] = useState(false);

  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | undefined
  >();

  const [hasReservesError, setReservesError] = useState<boolean>(false);
  const [hasEstimatedError, setEstimatedError] = useState<boolean>(false);

  const onSwapInputChange = (val: ISwapInputState) => {
    if (val.type === "A") {
      setAmountA(val.value);
    } else if (val.type === "B") {
      setAmountB(val.value);
    }
    setSwapInput(val);
  };

  const onInputSwitch = async () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(undefined);
    setAmountB(undefined);
  };

  // This is used in TokenList when users select a token.
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
    setAssetChangeModalActive(undefined);
  };

  // This is used after swap completed.
  const onAfterSwapCompleted = () => {
    setAmountA(undefined);
    setAmountB(undefined);
    increaseRefreshCount();
  };

  useEffect(() => {
    const load = async (_tokenA: ITokenState, _tokenB: ITokenState) => {
      setReservesError(false);
      try {
        const res = await swapRouter.getReserves(
          chain,
          network,
          _tokenA.hash,
          _tokenB.hash
        );

        setReserve(res);

        if (address) {
          const { amountA, amountB } = await swapRouter.getBalances(
            chain,
            network,
            address,
            _tokenA,
            _tokenB
          );
          setBalances({
            amountA,
            amountB,
          });
        }

        window.history.replaceState(
          null,
          "",
          `/#${location.pathname}?tokenA=${_tokenA.hash}&tokenB=${_tokenB.hash}`
        );
      } catch (e) {
        setReservesError(true);
        console.error(e);
      }
    };
    if (tokenA && tokenB) {
      load(tokenA, tokenB);
    }
  }, [address, tokenA, tokenB, refreshCount]);

  useEffect(() => {
    if (tokenA && tokenB && swapInput && swapInput.value !== undefined) {
      const delayDebounceFn = setTimeout(async () => {
        setEstimatedError(false);
        setAmountALoading(swapInput.type === "B");
        setAmountBLoading(swapInput.type === "A");

        let estimated;
        if (props.type === "swap") {
          estimated = await getEstimatedForSwap(
            chain,
            network,
            swapInput,
            tokenA,
            tokenB
          );
        } else if (props.type === "liquidity") {
          estimated = getEstimatedForLiquidity(
            swapInput,
            tokenA,
            tokenB,
            reserves
          );
        }
        if (estimated && estimated !== "0") {
          if (swapInput.type === "A") {
            setAmountB(estimated);
          } else {
            setAmountA(estimated);
          }
        }

        setAmountALoading(false);
        setAmountBLoading(false);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [swapInput, tokenA, tokenB]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setTokenA(undefined);
    setTokenB(undefined);
    setAmountA(undefined);
    setAmountB(undefined);
    setSwapInput(undefined);
    setReserve(undefined);
    setBalances(undefined);
    setAssetChangeModalActive(undefined);
    setAmountALoading(false);
    setAmountBLoading(false);
    toast.success("Chain switced!");
  }, [chain]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (params.tokenA) {
        const tokenA = await getTokenByHash(
          chain,
          network,
          params.tokenA as string
        );
        setTokenA(tokenA);
      }
      if (params.tokenB) {
        const tokenB = await getTokenByHash(
          chain,
          network,
          params.tokenB as string
        );
        setTokenB(tokenB);
      }
    };

    fetchTokens();
  }, [chain, network]);

  let noLiquidity = reserves?.shares === "0";
  let priceImpact = 0;
  if (tokenA && tokenB && !noLiquidity) {
    if (amountA && amountB) {
      try {
        const parsedAmountB = new Decimal(amountB).mul(
          new Decimal(10).pow(tokenB.decimals)
        );
        const reserveB = ethers.BigNumber.from(reserves?.reserveB);

        priceImpact = parsedAmountB
          .div(reserveB.toString())
          .mul(100)
          .toNumber();
      } catch (e) {
        console.error(e);
      }
    }
  }

  const contextValue = {
    chain,
    network,
    tokenA,
    tokenB,
    amountA,
    amountB,
    isAmountALoading,
    isAmountBLoading,
    swapInput,
    reserves,
    balances,
    slippage,
    noLiquidity,
    priceImpact,
    hasEstimatedError,
    hasReservesError,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
    onInputSwitch,
    onAfterSwapCompleted,
    toggleWalletSidebar,
  };

  return (
    <SwapContext.Provider value={contextValue}>
      {noLiquidity && (
        <ProvideLPInfo
          path={
            props.type === "swap"
              ? {
                  pathname: `${SWAP_PATH_LIQUIDITY_ADD}`,
                  search:
                    tokenA && tokenB
                      ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
                      : "",
                }
              : null
          }
        />
      )}
      {props.children}
      {isAssetChangeModalActive && (
        <TokenList
          chain={chain}
          network={network}
          activeTokenInput={isAssetChangeModalActive}
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive(undefined)}
        />
      )}

      <SwapSettings
        isActive={isSettingsModalActive}
        onClose={() => setSettingsModalActive(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
    </SwapContext.Provider>
  );
};

export const useSwap = () => useContext(SwapContext);

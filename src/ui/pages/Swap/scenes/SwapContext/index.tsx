import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import Decimal from "decimal.js";
import { ethers } from "ethers";

import { ISwapInputState } from "../Swap/interfaces";
import { IToken } from "../../../../../consts/tokens";
import { useLocation } from "react-router-dom";
import {
  ISwapReserves,
  IUserTokenBalances,
} from "../../../../../common/routers/swap/interfaces";
import { swapRouter } from "../../../../../common/routers";
import { CHAINS } from "../../../../../consts/chains";
import { DEFAULT_SLIPPAGE } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import { INetworkType } from "../../../../../packages/neo/network";
import {
  formatAmount,
  getParamsFromBrowser,
  getTokenByHash,
} from "../../../../../common/helpers";

import TokenList from "../../../../components/Commons/TokenList";
import SwapSettings from "../../components/Settings";
import { message } from "antd";
import {
  fetchTokenInfo,
  getPrices,
} from "../../../../../common/routers/global";
import { calculatePriceImpact } from "../Swap/helpers";

interface ISwapContext {
  type: "swap" | "liquidity";
  chain: CHAINS;
  network: INetworkType;
  tokenA: IToken | undefined;
  tokenB: IToken | undefined;
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
  isUnWrapping: boolean;
  isWrapping: boolean;
  isSwapWithWrapping: boolean;
  isSwapWithUnWrapping: boolean;
  notEnoughBalanceA?: boolean;
  notEnoughBalanceB?: boolean;
  prices: { [key: string]: number } | undefined;
  setAssetChangeModalActive: (v: "A" | "B" | undefined) => void;
  setSettingsModalActive: (v: boolean) => void;
  onSwapInputChange: (v: ISwapInputState) => void;
  onInputSwitch: () => void;
  onAfterSwapCompleted: () => void;
}

export const SwapContext = createContext({} as ISwapContext);

const getEstimatedForSwap = async (
  chain: CHAINS,
  network: INetworkType,
  swapInput: {
    type: "A" | "B";
    value: string;
  },
  tokenA: IToken,
  tokenB: IToken
) => {
  try {
    const args = {
      tokenA:
        tokenA.isNative && tokenA.nativePair
          ? tokenA.nativePair.hash
          : tokenA.hash,
      tokenB:
        tokenB.isNative && tokenB.nativePair
          ? tokenB.nativePair.hash
          : tokenB.hash,
      amount: ethers
        .parseUnits(
          swapInput.value,
          swapInput.type === "A"
            ? tokenA.isNative && tokenA.nativePair
              ? tokenA.nativePair.decimals
              : tokenA.decimals
            : tokenB.isNative && tokenB.nativePair
            ? tokenB.nativePair.decimals
            : tokenB.decimals
        )
        .toString(),
      isReverse: swapInput.type === "B",
    };

    const estimated = await swapRouter.getEstimate(chain, network, args);
    if (estimated !== "0") {
      return formatAmount(
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
  tokenA: IToken,
  tokenB: IToken,
  reserves: ISwapReserves | undefined
) => {
  if (reserves && swapInput.value && reserves && reserves.shares !== "0") {
    const val = ethers.parseUnits(
      swapInput.value.toString(),
      swapInput.type === "A" ? tokenA.decimals : tokenB.decimals
    );

    const numerator =
      swapInput.type === "A"
        ? BigInt(reserves.reserveB)
        : BigInt(reserves.reserveA);
    const denominator =
      swapInput.type === "A"
        ? BigInt(reserves.reserveA)
        : BigInt(reserves.reserveB);

    const estimated = (val * numerator) / denominator;

    return formatAmount(
      estimated.toString(),
      swapInput.type === "A" ? tokenB.decimals : tokenA.decimals
    );
  }

  return null;
};

export const SwapContextProvider = ({
  type,
  children,
  chain,
  network,
  refreshCount,
  userWalletAddress,
  increaseRefreshCount,
}: {
  type: "swap" | "liquidity";
  children: any;
  chain: CHAINS;
  network: INetworkType;
  refreshCount: number;
  userWalletAddress?: string;
  increaseRefreshCount: () => void;
}) => {
  const location = useLocation();
  const [tokenA, setTokenA] = useState<IToken | undefined>();
  const [tokenB, setTokenB] = useState<IToken | undefined>();

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

  const [prices, setPrices] = useState<{ [key: string]: number }>();

  const onSwapInputChange = (val: ISwapInputState) => {
    if (val.type === "A") {
      setAmountA(val.value);
    } else if (val.type === "B") {
      setAmountB(val.value);
    }
    setSwapInput(val);
  };

  const onInputSwitch = async () => {
    setAmountA(undefined);
    setAmountB(undefined);
    setSwapInput(undefined);
    setTokenA(tokenB);
    setTokenB(tokenA);
  };

  // This is used in TokenList when users select a token.
  const onAssetClick = (token: IToken) => {
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
    setSwapInput(undefined);
    setAmountA(undefined);
    setAmountB(undefined);
    setAssetChangeModalActive(undefined);
  };

  // This is used after swap completed.
  const onAfterSwapCompleted = () => {
    setAmountA(undefined);
    setAmountB(undefined);
    increaseRefreshCount();
  };

  const fetchPairReserves = async () => {
    try {
      if (tokenA && tokenB) {
        setReserve(undefined);
        setBalances(undefined);
        setReservesError(false);
        
        setPrices(await getPrices(chain));

        const res = await swapRouter.getReserves(
          chain,
          network,
          tokenA.isNative && tokenA.nativePair
            ? tokenA.nativePair.hash
            : tokenA.hash,
          tokenB.isNative && tokenB.nativePair
            ? tokenB.nativePair.hash
            : tokenB.hash
        );
        setReserve(res);
        if (userWalletAddress) {
          const { amountA, amountB } = await swapRouter.getBalances(
            chain,
            network,
            userWalletAddress,
            tokenA,
            tokenB
          );
          setBalances({
            amountA,
            amountB,
          });
        }
        window.history.replaceState(
          null,
          "",
          `/#${location.pathname}?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
        );
      }
    } catch (e) {
      setReservesError(true);
      console.error("fetchPairReserves error", e);
    }
  };

  const resetStates = () => {
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
    window.history.replaceState(null, "", `/#${location.pathname}`);
    message.success("Chain switced!");
    increaseRefreshCount();
  };

  const setTokensFromParams = async () => {
    let tokenA: IToken | undefined;
    let tokenB: IToken | undefined;
    const params = getParamsFromBrowser();
    if (params) {
      if (params.tokenA) {
        tokenA = getTokenByHash(chain, network, params.tokenA as string);
        if (!tokenA) {
          const res = await fetchTokenInfo(
            chain,
            network,
            params.tokenA as string
          );
          if (res) {
            tokenA = res;
          }
        }
      }
      if (params.tokenB) {
        tokenB = getTokenByHash(chain, network, params.tokenB as string);
        if (!tokenB) {
          const res = await fetchTokenInfo(
            chain,
            network,
            params.tokenB as string
          );
          if (res) {
            tokenB = res;
          }
        }
      }
      if (tokenA && tokenB) {
        setTokenA(tokenA);
        setTokenB(tokenB);
      } else {
        window.history.replaceState(null, "", `/#${location.pathname}`);
      }
    }
  };

  const getEstimated = async () => {
    if (tokenA && tokenB && swapInput && swapInput.value !== undefined) {
      if (tokenA && tokenB && swapInput && swapInput.value !== undefined) {
        const delayDebounceFn = setTimeout(async () => {
          setEstimatedError(false);
          setAmountALoading(swapInput.type === "B");
          setAmountBLoading(swapInput.type === "A");

          let estimated;
          if (type === "swap") {
            if (isUnWrapping || isWrapping) {
              estimated = swapInput.value;
            } else {
              estimated = await getEstimatedForSwap(
                chain,
                network,
                swapInput as any,
                tokenA,
                tokenB
              );
            }
          } else if (type === "liquidity") {
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
    }
  };

  let isWrapping = false;
  let isUnWrapping = false;
  let isSwapWithWrapping = false;
  let isSwapWithUnWrapping = false;
  let notEnoughBalanceA: boolean | undefined = undefined;
  let notEnoughBalanceB: boolean | undefined = undefined;
  let noLiquidity = reserves?.shares === "0";
  let priceImpact = 0;

  if (tokenA && tokenB && !noLiquidity && amountA && reserves) {
    let tokenADecimals = tokenA.nativePair
      ? tokenA.nativePair.decimals
      : tokenA.decimals;

    priceImpact = calculatePriceImpact(
      ethers.parseUnits(amountA, tokenADecimals).toString(),
      reserves.reserveA,
      reserves.reserveB
    );
  }

  if (balances && amountA) {
    if (new Decimal(balances.amountA).lt(new Decimal(amountA))) {
      notEnoughBalanceA = true;
    } else {
      notEnoughBalanceA = false;
    }
  }

  if (balances && amountB) {
    if (new Decimal(balances.amountB).lt(new Decimal(amountB))) {
      notEnoughBalanceB = true;
    } else {
      notEnoughBalanceB = false;
    }
  }

  if (tokenA && tokenA.nativePair) {
    if (tokenA.nativePair.hash === tokenB?.hash) {
      isWrapping = true;
    } else {
      isSwapWithWrapping = true;
    }
  }

  if (tokenB && tokenB.nativePair) {
    if (tokenB.nativePair.hash === tokenA?.hash) {
      isUnWrapping = true;
    } else {
      isSwapWithUnWrapping = true;
    }
  }

  /* 
    Reset all states when chain changed
  */
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      resetStates();
    }
  }, [chain]);
  /*
    Get estimated amount when user input amount
  */
  useEffect(() => {
    (async () => {
      getEstimated();
    })();
  }, [swapInput, tokenA, tokenB]);

  /* 
    Get token info from browser query params
  */

  useEffect(() => {
    (async () => {
      await setTokensFromParams();
    })();
  }, [chain, network]);

  /*
    Get reserves and balances when tokenA and tokenB are set
  */
  useEffect(() => {
    (async () => {
      await fetchPairReserves();
    })();
  }, [tokenA, tokenB, refreshCount, userWalletAddress]);

  const contextValue = {
    type,
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
    isWrapping,
    isUnWrapping,
    isSwapWithWrapping,
    isSwapWithUnWrapping,
    notEnoughBalanceA,
    notEnoughBalanceB,
    prices,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
    onInputSwitch,
    onAfterSwapCompleted,
  };
  return (
    <SwapContext.Provider value={contextValue}>
      {children}

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

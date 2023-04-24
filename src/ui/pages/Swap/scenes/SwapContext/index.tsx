import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import { ISwapInputState, ITokenState } from "../Swap/interfaces";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useApp } from "../../../../../common/hooks/use-app";
import {
  ISwapReserves,
  IUserTokenBalances
} from "../../../../../common/routers/swap/interfaces";
import { swapRouter } from "../../../../../common/routers";
import { CHAINS, NEO_CHAIN } from "../../../../../consts/chains";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { ethers } from "ethers";
import TokenList from "../../../../components/Commons/TokenList";
import SwapSettings from "../../components/Settings";
import { DEFAULT_SLIPPAGE } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import { INetworkType } from "../../../../../packages/neo/network";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import toast from "react-hot-toast";
import { getTokenByHash } from "../../../../../helpers";

interface ISwapContext {
  chain: CHAINS;
  network: INetworkType;
  tokenA: ITokenState | undefined;
  tokenB: ITokenState | undefined;
  amountA: number | undefined;
  amountB: number | undefined;
  isAmountALoading: boolean;
  isAmountBLoading: boolean;
  swapInput: ISwapInputState | undefined;
  reserves: ISwapReserves | undefined;
  balances: IUserTokenBalances | undefined;
  slippage: number;
  noLiquidity: boolean;
  priceImpact: number;
  inputError?: string | undefined;
  reservesError?: string | undefined;
  setTokenA: (token: ITokenState | undefined) => void;
  setTokenB: (token: ITokenState | undefined) => void;
  setAmountA: (amount: number | undefined) => void;
  setAmountB: (amount: number | undefined) => void;
  setSwapInput: (v: ISwapInputState | undefined) => void;
  setAssetChangeModalActive: (v: "A" | "B" | undefined) => void;
  setSettingsModalActive: (v: boolean) => void;
  onSwapInputChange: (v: ISwapInputState) => void;
  onInputSwitch: () => void;
  onAfterSwapCompleted: () => void;
  toggleWalletSidebar: () => void;
}

export const SwapContext = createContext({} as ISwapContext);

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
    toggleWalletSidebar
  } = useApp();
  const { connectedWallet } = useNeoWallets();
  const { address, isConnected } = useWalletRouter(chain);

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

  const [amountA, setAmountA] = useState<number | undefined>();
  const [amountB, setAmountB] = useState<number | undefined>();

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

  const [reservesError, setReservesError] = useState<string | undefined>();
  const [inputError, setInputError] = useState<string | undefined>();

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
    setAmountB(undefined);
    setAmountA(undefined);
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
      setReservesError(undefined);
      try {
        const res = await swapRouter.getReserves(
          chain,
          network,
          _tokenA.hash,
          _tokenB.hash
        );

        setReserve(res);

        let _address =
          chain === NEO_CHAIN ? connectedWallet?.account.address : address;

        if (_address) {
          const { amountA, amountB } = await swapRouter.getBalances(
            chain,
            network,
            _address,
            _tokenA,
            _tokenB
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
        setReservesError("Failed to fetch reserves.");
        console.error(e);
      }
    };
    if (tokenA && tokenB) {
      load(tokenA, tokenB);
    }
  }, [address, tokenA, tokenB, refreshCount, connectedWallet]);

  useEffect(() => {
    if (tokenA && tokenB && swapInput && swapInput.value !== undefined) {
      const delayDebounceFn = setTimeout(async () => {
        setInputError(undefined);
        if (swapInput.type === "A") {
          setAmountBLoading(true);
        } else {
          setAmountALoading(true);
        }

        try {
          if (swapInput.value) {
            let estimated;
            if (props.type === "swap") {
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
              estimated = await swapRouter.getEstimate(chain, network, args);
            } else if (props.type === "liquidity") {
              if (reserves) {
                const val = ethers.utils.parseUnits(
                  swapInput.value.toString(),
                  swapInput.type === "A" ? tokenA.decimals : tokenB.decimals
                );
                estimated = val
                  .mul(
                    swapInput.type === "A"
                      ? reserves.reserveB
                      : reserves.reserveA
                  )
                  .div(
                    swapInput.type === "A"
                      ? reserves.reserveA
                      : reserves.reserveB
                  )
                  .toString();
              }
            }

            if (swapInput.type === "A") {
              estimated = ethers.utils.formatUnits(estimated, tokenB.decimals);
              setAmountBLoading(false);
              setAmountB(+estimated);
            } else {
              estimated = ethers.utils.formatUnits(estimated, tokenA.decimals);
              setAmountALoading(false);
              setAmountA(+estimated);
            }
          }
        } catch (e: any) {
          console.error(e);
          setInputError("Failed to fetch estimate. Check your inputs.");
          setAmountALoading(false);
          setAmountBLoading(false);
        }
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [swapInput]);

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

  let noLiquidity = false;
  let priceImpact = 0;

  if (tokenA && tokenB && reserves) {
    noLiquidity = reserves.shares === "0";
    if (amountA && amountB) {
      priceImpact = (amountB / parseFloat(reserves.reserveB)) * 100;
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
    inputError,
    reservesError,
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    setSwapInput,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange,
    onInputSwitch,
    onAfterSwapCompleted,
    toggleWalletSidebar
  };

  return (
    <SwapContext.Provider value={contextValue}>
      <>
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
      </>
    </SwapContext.Provider>
  );
};

export const useSwap = () => useContext(SwapContext);
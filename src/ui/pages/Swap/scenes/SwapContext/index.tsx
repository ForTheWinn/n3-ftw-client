import React, { createContext, useContext, useEffect, useState } from "react";
import { ISwapInputState, ITokenState } from "../Swap/interfaces";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { getTokenByHash } from "../Swap/helpers";
import { useApp } from "../../../../../common/hooks/use-app";
import {
  ISwapReserves,
  IUserTokenBalances
} from "../../../../../common/routers/swap/interfaces";
import { swapRouter } from "../../../../../common/routers";
import { NEO_CHAIN } from "../../../../../consts/chains";
import { useWallet } from "../../../../../packages/neo/provider";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import TokenList from "../../../../components/Commons/TokenList";
import SwapSettings from "../../components/Settings";
import { DEFAULT_SLIPPAGE } from "../../../../../packages/neo/contracts/ftw/swap/consts";

interface ISwapContext {
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
  setTokenA: (token: ITokenState | undefined) => void;
  setTokenB: (token: ITokenState | undefined) => void;
  setAmountA: (amount: number | undefined) => void;
  setAmountB: (amount: number | undefined) => void;
  setSwapInput: (v: ISwapInputState | undefined) => void;
  setAssetChangeModalActive: (v: "A" | "B" | undefined) => void;
  setSettingsModalActive: (v: boolean) => void;
  onSwapInputChange: (v: ISwapInputState) => void;
}

export const SwapContext = createContext({} as ISwapContext);

export const SwapContextProvider = (props: { children: any }) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { chain, network, refreshCount } = useApp();
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

  const [error, setError] = useState<string | undefined>();

  const onSwapInputChange = (val: ISwapInputState) => {
    if (val.type === "A") {
      setAmountA(val.value);
    } else if (val.type === "B") {
      setAmountB(val.value);
    }
    setSwapInput(val);
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

  const contextValue = {
    tokenA,
    tokenB,
    amountA,
    amountB,
    isAmountALoading,
    isAmountBLoading,
    swapInput,
    reserves,
    balances,
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    setSwapInput,
    setAssetChangeModalActive,
    setSettingsModalActive,
    onSwapInputChange
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

import React, { useEffect, useState } from "react";
import {
  fetchBalance,
  writeContract,
  getNetwork,
  waitForTransaction,
} from "@wagmi/core";
import { useApp } from "../../../../../../common/hooks/use-app";
import { useAccount } from "wagmi";
import { BigNumberish, ethers } from "ethers";
import queryString from "query-string";

import { defaultDeadLine } from "../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { DEFAULT_SLIPPAGE } from "../../../../../../packages/neo/contracts/ftw/swap/consts";
import { POLYGON_TOKENS } from "../../../../../../packages/polygon";

import AssetListModal from "./TokenList";
import ProvideLPInfo from "../../../components/ProvideLPInfo";
import SwapInputs from "./SwapInputs";
import SwapDetails from "../components/SwapDetails/SwapDetails";
import SwapButton from "../../../components/SwapButton";
import SwapNav from "../components/SwapNav";
import ReservesFetchError from "../components/Notifications/ReservesFetchError";

import {
  IBalancesState,
  IReservesState,
  ISwapInputState,
  ITokenState,
} from "../interfaces";

import {
  approve,
  getAllowances,
  getEstimated,
  getReserves,
  provide,
  swap,
} from "../../../../../../packages/polygon/api";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getTokenByHash } from "../helpers";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../../consts";
import ActionModal from "../../AddLiquidity/Polygon/ActionModal";

interface ISwapProps {
  rootPath: string;
}

const PolygonSwap = ({ rootPath }: ISwapProps) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { toggleWalletSidebar } = useApp();
  const { address, isConnected } = useAccount();
  const { chain } = getNetwork();

  const [tokenA, setTokenA] = useState<ITokenState | undefined>(
    params.tokenA
      ? getTokenByHash(POLYGON_TOKENS, params.tokenA as string)
      : undefined
  );
  const [tokenB, setTokenB] = useState<ITokenState | undefined>(
    params.tokenB
      ? getTokenByHash(POLYGON_TOKENS, params.tokenB as string)
      : undefined
  );

  const [reserves, setReserve] = useState<IReservesState | undefined>();
  const [balances, setBalances] = useState<IBalancesState | undefined>();

  const [amountA, setAmountA] = useState<number | undefined>();
  const [amountB, setAmountB] = useState<number | undefined>();

  const [swapInput, setSwapInput] = useState<ISwapInputState>();

  const [isActionModalActive, setActionModalActive] = useState(false);
  const [isTokenAApproved, setTokenAApproved] = useState(false);
  const [isTokenAApprving, setTokenAApproving] = useState(false);
  const [isTokenBApproved, setTokenBApproved] = useState(false);
  const [isTokenBApprving, setTokenBApproving] = useState(false);
  const [isSwapDone, setSwapDone] = useState(false);
  const [isSwapping, setSwapping] = useState(false);

  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | ""
  >("");

  const [isAmountALoading, setAmountALoading] = useState(false);
  const [isAmountBLoading, setAmountBLoading] = useState(false);

  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);

  const [txid, setTxid] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<any>();
  const [refresh, setRefresh] = useState(0);

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

  const onSwapInputChange = (val: ISwapInputState) => {
    if (val.type === "A") {
      setAmountA(val.value);
    } else if (val.type === "B") {
      setAmountB(val.value);
    }
    setSwapInput(val);
  };

  const onReset = () => {
    setRefresh(refresh + 1);
    setTokenAApproved(false);
    setTokenAApproving(false);
    setTokenBApproved(false);
    setTokenBApproving(false);
    setSwapDone(false);
    setSwapping(false);
    setTxid(undefined);
    setActionModalActive(false);
  };

  const onSwitch = async () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(undefined);
    setAmountB(undefined);
  };

  const onSwap = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput && address) {
      const amountIn =
        swapInput.type === "A"
          ? ethers.utils
              .parseUnits(amountA.toString(), tokenA.decimals)
              .toString()
          : ethers.utils
              .parseUnits(amountA.toString(), tokenA.decimals)
              .add(
                ethers.utils
                  .parseUnits(amountA.toString(), tokenA.decimals)
                  .mul(slippage)
                  .div(100)
              )
              .toString();
      const amountOut =
        swapInput.type === "A"
          ? ethers.utils
              .parseUnits(amountB.toString(), tokenB.decimals)
              .toString()
          : ethers.utils
              .parseUnits(amountB.toString(), tokenB.decimals)
              .sub(
                ethers.utils
                  .parseUnits(amountB.toString(), tokenB.decimals)
                  .mul(slippage)
                  .div(100)
              )
              .toString();

      const args = [
        tokenA.hash,
        tokenB.hash,
        amountIn,
        amountOut,
        defaultDeadLine(),
        swapInput.type === "B",
      ];
      try {
        setActionModalActive(true);
        const allowances = await getAllowances(
          address,
          tokenA.hash,
          tokenB.hash
        );

        if (allowances[0].toString() === "0") {
          const config = await approve(tokenA.hash);
          const res = await writeContract(config);
          setTokenAApproving(true);
          await res.wait();
          setTokenAApproved(true);
          setTokenAApproving(false);
        } else {
          setTokenAApproved(true);
        }

        if (allowances[1].toString() === "0") {
          const config = await approve(tokenB.hash);
          const res = await writeContract(config);
          setTokenBApproving(true);
          await res.wait();
          setTokenBApproved(true);
          setTokenBApproving(false);
        } else {
          setTokenBApproved(true);
        }

        const config = await swap(args);
        const { hash } = await writeContract(config);
        setSwapping(true);
        setTxid(hash);

        const data = await waitForTransaction({
          hash,
        });
        setSwapDone(true);
        setSwapping(false);
      } catch (e: any) {
        if (e.reason) {
          toast.error(e.reason);
        }
      }
    }
  };

  useEffect(() => {
    const load = async (_tokenA, _tokenB) => {
      setError(undefined);
      try {
        const res = await getReserves(_tokenA, _tokenB);
        setReserve(res);
        console.log(res);

        if (address) {
          const tokenAbalance = await fetchBalance({
            address,
            token: _tokenA.hash,
          });
          console.log(tokenAbalance);

          const tokenBbalance = await fetchBalance({
            address,
            token: _tokenB.hash,
          });

          setBalances({
            amountA: tokenAbalance.formatted,
            amountB: tokenBbalance.formatted,
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
            const args = [
              tokenA.hash,
              tokenB.hash,
              ethers.utils
                .parseUnits(
                  swapInput.value.toString(),
                  swapInput.type === "A" ? tokenA.decimals : tokenB.decimals
                )
                .toString(),
              swapInput.type === "B",
            ];
            const data = await getEstimated(args);

            if (data) {
              estimated = ethers.utils.formatUnits(
                data as BigNumberish,
                swapInput.type === "A" ? tokenB.decimals : tokenA.decimals
              );
            }
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
    <div>
      <SwapNav
        rootPath={rootPath}
        search={
          tokenA && tokenB
            ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
            : undefined
        }
      />

      <hr className="is-hidden-mobile" />

      {noLiquidity && tokenA && tokenB ? (
        <ProvideLPInfo
          path={{
            pathname: `${rootPath}${SWAP_PATH_LIQUIDITY_ADD}`,
            search:
              tokenA && tokenB
                ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
                : "",
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
          activeTokenInput={isAssetChangeModalActive}
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive("")}
        />
      )}

      {isActionModalActive && tokenA && tokenB && (
        <ActionModal
          title="Swap"
          tokenA={tokenA}
          tokenB={tokenB}
          isTokenAApproved={isTokenAApproved}
          isTokenBApproved={isTokenBApproved}
          isTokenAApproving={isTokenAApprving}
          isTokenBApproving={isTokenBApprving}
          isSwapping={isSwapping}
          isSwapDone={isSwapDone}
          txid={txid}
          explorer={chain ? chain.blockExplorers?.default.url : ""}
          onClose={onReset}
        />
      )}
    </div>
  );
};

export default PolygonSwap;

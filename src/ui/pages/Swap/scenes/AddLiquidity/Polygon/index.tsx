import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { fetchBalance, writeContract, getNetwork } from "@wagmi/core";

import { useApp } from "../../../../../../common/hooks/use-app";
import { getTokenByHash } from "../../Swap/helpers";
import {
  getLPEstimate,
  getReserves,
  provide,
  swap,
} from "../../../../../../packages/polygon/api";
import { defaultDeadLine } from "../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { DEFAULT_SLIPPAGE } from "../../../../../../packages/neo/contracts/ftw/swap/consts";
import { POLYGON_TOKENS } from "../../../../../../packages/polygon";

import AssetListModal from "../../Swap/NEO/TokenList";
import LPRewardInfo from "../components/LPRewardInfo";
import LPInputs from "./Inputs";
import SwapButton from "../../../components/SwapButton";
import Nav from "../components/Nav";
import Modal from "../../../../../components/Modal";
import HandleTxid from "../../../../../components/PolygonComponents/HandleTxid";

import {
  IBalancesState,
  IReservesState,
  ISwapInputState,
  ITokenState,
} from "../../Swap/interfaces";

interface ILiquidityProps {
  rootPath: string;
}

const Liquidity = ({ rootPath }: ILiquidityProps) => {
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

  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | ""
  >("");

  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);

  const [txid, setTxid] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<any>();
  // const [refresh, setRefresh] = useState(0);

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
      if (!val.value) {
        setAmountB(undefined);
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
      if (!val.value) {
        setAmountA(undefined);
      }
    }
    setSwapInput(val);
  };

  const onSuccess = () => {
    setAmountA(undefined);
    setAmountB(undefined);
    setTxid(undefined);
  };

  const onProvide = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput) {
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
        ethers.utils.parseUnits(amountA.toString(), tokenA.decimals).toString(),

        tokenB.hash,
        ethers.utils.parseUnits(amountB.toString(), tokenB.decimals).toString(),
        slippage,
        defaultDeadLine(),
      ];
      try {
        const config = await provide(args);
        const { hash } = await writeContract(config);
        setTxid(hash);
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
  }, [address, tokenA, tokenB]);

  let noLiquidity = false;

  if (tokenA && tokenB && reserves && amountA && amountB && reserves) {
    noLiquidity = reserves.shares === "0";
    console.log(reserves);
  }

  const toMain = {
    pathname: `${rootPath}`,
    search:
      tokenA && tokenB ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}` : "",
  };

  const title = noLiquidity ? "Create a new pool" : "Provide liquidity";

  return (
    <>
      <Nav
        path={toMain}
        title={title}
        slippage={slippage}
        setSlippage={setSlippage}
      />
      <hr />

      {noLiquidity && <LPRewardInfo />}

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
          label={"Do it!"}
          isLoading={false}
          isWalletConnected={isConnected}
          isActive={
            !!tokenA || !!tokenB || !!amountA || !!amountB || !noLiquidity
          }
          onClick={onProvide}
        />
      </div>

      {txid && chain && (
        <Modal onClose={() => setTxid(undefined)}>
          <HandleTxid
            explorer={chain.blockExplorers?.default.url}
            txid={txid}
            onSuccess={onSuccess}
            onError={() => setTxid(undefined)}
          />
        </Modal>
      )}

      {isAssetChangeModalActive && (
        <AssetListModal
          activeTokenInput={isAssetChangeModalActive}
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive("")}
          filterDecimals={true}
          noNEOBNEO={true}
        />
      )}
    </>
  );
};

export default Liquidity;

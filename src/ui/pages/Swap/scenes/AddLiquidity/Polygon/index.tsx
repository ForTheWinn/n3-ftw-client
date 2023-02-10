import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import {
  fetchBalance,
  writeContract,
  getNetwork,
  waitForTransaction,
} from "@wagmi/core";

import { useApp } from "../../../../../../common/hooks/use-app";
import { getTokenByHash } from "../../Swap/helpers";
import {
  approve,
  getAllowances,
  getLPEstimate,
  getReserves,
  provide,
} from "../../../../../../packages/polygon/api";
import { defaultDeadLine } from "../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { DEFAULT_SLIPPAGE } from "../../../../../../packages/neo/contracts/ftw/swap/consts";
import { POLYGON_TOKENS } from "../../../../../../packages/polygon";

import AssetListModal from "../../Swap/Polygon/TokenList";
import LPInputs from "./Inputs";
import SwapButton from "../../../components/SwapButton";
import Nav from "../components/Nav";

import {
  IBalancesState,
  IReservesState,
  ISwapInputState,
  ITokenState,
} from "../../Swap/interfaces";
import ProvideLPInfo from "../../../components/ProvideLPInfo";
import ActionModal from "./ActionModal";

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
    setRefresh(refresh + 1);
    setTokenAApproved(false);
    setTokenAApproving(false);
    setTokenBApproved(false);
    setTokenBApproving(false);
    setSwapDone(false)
    setSwapping(false)
    setTxid(undefined);
    setActionModalActive(false)
  };

  const onProvide = async () => {
    if (tokenA && tokenB && amountA && amountB && swapInput && address) {
      setActionModalActive(true);
      try {
        const args = [
          tokenA.hash,
          ethers.utils
            .parseUnits(amountA.toString(), tokenA.decimals)
            .toString(),

          tokenB.hash,
          ethers.utils
            .parseUnits(amountB.toString(), tokenB.decimals)
            .toString(),
          slippage,
          defaultDeadLine(),
        ];

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

        const config = await provide(args);
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
          // setActionModalActive(false);
          toast.error(e.reason);
        }
      }
    }
  };

  useEffect(() => {
    const load = async (_tokenA: ITokenState, _tokenB: ITokenState) => {
      setError(undefined);
      try {
        const res = await getReserves(_tokenA, _tokenB);
        setReserve(res);

        if (address) {
          const tokenAbalance = await fetchBalance({
            address,
            token: _tokenA.hash as `0x${string}`,
          });
          console.log(tokenAbalance);

          const tokenBbalance = await fetchBalance({
            address,
            token: _tokenB.hash as `0x${string}`,
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

  let noLiquidity = false;

  if (tokenA && tokenB && reserves) {
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
          label={"Do it!"}
          isLoading={false}
          isWalletConnected={isConnected}
          isActive={
            !!tokenA || !!tokenB || !!amountA || !!amountB || !noLiquidity
          }
          onClick={onProvide}
        />
      </div>

      {/* {txid && chain && (
        <Modal onClose={() => setTxid(undefined)}>
          <HandleTxid
            explorer={chain.blockExplorers?.default.url}
            txid={txid}
            onSuccess={onSuccess}
            onError={() => setTxid(undefined)}
          />
        </Modal>
      )} */}

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
          title="Add Liquidity"
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
    </>
  );
};

export default Liquidity;

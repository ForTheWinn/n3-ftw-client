import React, { useEffect, useState } from "react";
import _ from "underscore";
import { u } from "@cityofzion/neon-core";
import { toast } from "react-hot-toast";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

import { useApp } from "../../../../../../common/hooks/use-app";
import { useWallet } from "../../../../../../packages/provider";
import { SwapContract } from "../../../../../../packages/neo/contracts";
import { fakeNEOBNEOReserve } from "../helpers";
import { handleError } from "../../../../../../packages/neo/utils/errors";
import {
  getAfterSlippage,
  getMaxTokenAAmount,
} from "../../../../../../packages/neo/contracts/ftw/swap/helpers";

import { DEFAULT_SLIPPAGE } from "../../../../../../packages/neo/contracts/ftw/swap/consts";
import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
} from "../../../../../../packages/neo/consts/neo-token-hashes";
import { BNEOContract } from "../../../../../../packages/neo/contracts/ftw/bneo";

import AssetListModal from "./TokenList";

import Modal from "../../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../components/NeoComponents/AfterTransactionSubmitted";
import ErrorNotificationWithRefresh from "../../../../../components/ErrorNotificationWithRefresh";
import SwapInputs from "./SwapInputs";
import BNEOInfo from "../components/Notifications/BNEOInfo";
import SwapButton from "../../../components/SwapButton";
import SwapNav from "../components/SwapNav";

import { IReserveData } from "../../../../../../packages/neo/contracts/ftw/swap/interfaces";
import { ITokenState } from "../interfaces";
import SwapDetails from "../components/SwapDetails/SwapDetails";

import ProvideLPInfo from "../../../components/ProvideLPInfo";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../../consts";
import SwapSettings from "../../../components/Settings";

interface ISwapProps {
  rootPath: string;
}
const NEOSwap = ({ rootPath }: ISwapProps) => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { chain, toggleWalletSidebar } = useApp();
  const { network, connectedWallet } = useWallet();
  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | ""
  >("");
  const [isPoolListModalActive, setPoolListModalActive] = useState(false);
  const [isSwapHistoryModalActive, setSwapHistoryModalActive] = useState(false);
  const [isLPListModalActive, setLPListModalActive] = useState(false);

  // TODO: Save pair history in local storage (Temporary disabled)
  // const cachedTokenA = LocalStorage.getSwapTokenA();
  // const cachedTokenB = LocalStorage.getSwapTokenB();
  const [tokenA, setTokenA] = useState<ITokenState | undefined>(
    _.isEmpty(params)
      ? {
          hash: GAS_SCRIPT_HASH,
          symbol: "GAS",
          decimals: 8,
          icon: "/symbols/gas.svg",
        }
      : undefined
  );
  const [tokenB, setTokenB] = useState<ITokenState | undefined>();
  const [amountA, setAmountA] = useState<number | undefined>();
  const [amountB, setAmountB] = useState<number | undefined>();
  const [swapType, setSwapType] = useState<"AtoB" | "BtoA" | undefined>();
  const [data, setData] = useState<IReserveData | undefined>();
  const [isSettingsActive, setSettingsActive] = useState(false);
  const [slippage, setSlippage] = useState<number | undefined>(
    DEFAULT_SLIPPAGE
  );
  const [isSwapDetailActive, setSwapDetailActive] = useState(false);
  const [isPairLoading, setPairLoading] = useState(false);
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState(undefined);

  const onAssetChange = (type: "A" | "B" | "") => {
    setAssetChangeModalActive(type);
  };

  const onAssetClick = (token: ITokenState) => {
    if (isAssetChangeModalActive === "A") {
      // LocalStorage.setSwapTokenA(hash);
      setTokenA(token);
      if (tokenB) {
        let search = `?tokenA=${token.hash}&tokenB=${tokenB.hash}`;
        history.push(search);
      }
    } else {
      // LocalStorage.setSwapTokenB(assetHash);
      setTokenB(token);
      if (tokenA) {
        let search = `?tokenA=${tokenA.hash}&tokenB=${token.hash}`;
        history.push(search);
      }
    }
    setAmountB(undefined);
    setAmountA(undefined);
    setAssetChangeModalActive("");
  };

  const onRefresh = () => {
    setRefresh(refresh + 1);
  };

  const onSuccess = () => {
    setAmountA(undefined);
    setAmountB(undefined);
    setRefresh(refresh + 1);
    setTxid("");
  };

  const onSwap = async () => {
    if (connectedWallet) {
      if (
        tokenA &&
        tokenB &&
        amountA &&
        amountB &&
        data &&
        slippage &&
        tokenA &&
        tokenB &&
        swapType
      ) {
        try {
          const bNEOHash = BNEO_SCRIPT_HASH[network];
          let res;
          if (
            (tokenA.hash === NEO_SCRIPT_HASH && tokenB.hash === bNEOHash) ||
            (tokenA.hash === bNEOHash && tokenB.hash === NEO_SCRIPT_HASH)
          ) {
            if (tokenA.hash === NEO_SCRIPT_HASH) {
              res = await new BNEOContract(network).mint(
                connectedWallet,
                amountA
              );
            } else {
              res = await new BNEOContract(network).redeem(
                connectedWallet,
                amountB
              );
            }
          } else {
            if (swapType === "AtoB") {
              if (tokenA.hash === NEO_SCRIPT_HASH) {
                res = await new SwapContract(network).swapWithNEO(
                  connectedWallet,
                  amountA,
                  tokenB.hash,
                  tokenB.decimals,
                  getAfterSlippage(amountB, slippage)
                );
              } else {
                res = await new SwapContract(network).swap(
                  connectedWallet,
                  tokenA.hash,
                  tokenA.decimals,
                  amountA,
                  tokenB.hash,
                  tokenB.decimals,
                  getAfterSlippage(amountB, slippage)
                );
              }
            } else {
              if (tokenB.hash === NEO_SCRIPT_HASH) {
                res = await new SwapContract(network).swapBWithNEO(
                  connectedWallet,
                  tokenA.hash,
                  tokenA.decimals,
                  amountB,
                  getMaxTokenAAmount(amountA, slippage)
                );
              } else {
                res = await new SwapContract(network).swapBtoA(
                  connectedWallet,
                  tokenA.hash,
                  tokenA.decimals,
                  tokenB.hash,
                  tokenB.decimals,
                  amountB,
                  getMaxTokenAAmount(amountA, slippage)
                );
              }
            }
          }

          setTxid(res);
        } catch (e: any) {
          toast.error(handleError(e));
        }
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const onSwitch = async () => {
    if (tokenA || tokenB) {
      if (tokenA && tokenB) {
        let search = `?tokenA=${tokenB.hash}&tokenB=${tokenA.hash}`;
        history.push(search);
      }
      /*
			Let's reset amounts when user switch input
			 */
      setAmountA(undefined);
      setAmountB(undefined);
    }
  };

  const onPairClick = (tokenAHash, tokenBHash) => {
    let search = `?tokenA=${tokenAHash}&tokenB=${tokenBHash}`;
    history.push(search);
    setAmountA(undefined);
    setAmountB(undefined);
    setPoolListModalActive(false);
  };

  useEffect(() => {
    async function load(tokenAHash, tokenBHash) {
      setError(undefined);
      setPairLoading(true);

      const bNEOHash = BNEO_SCRIPT_HASH[network];

      if (
        (tokenAHash === NEO_SCRIPT_HASH && tokenBHash === bNEOHash) ||
        (tokenAHash === bNEOHash && tokenBHash === NEO_SCRIPT_HASH)
      ) {
        // bNEO converting
        try {
          let balances = await new SwapContract(network).getNEObNEOBalance(
            connectedWallet
          );

          const res = fakeNEOBNEOReserve(bNEOHash, balances);

          setData(res);
          setTokenA({
            hash: tokenAHash,
            symbol: tokenAHash === NEO_SCRIPT_HASH ? "NEO" : "bNEO",
            decimals: tokenAHash === NEO_SCRIPT_HASH ? 0 : 8,
            icon: "",
          });
          setTokenB({
            hash: tokenBHash,
            symbol: tokenBHash === NEO_SCRIPT_HASH ? "NEO" : "bNEO",
            decimals: tokenBHash === NEO_SCRIPT_HASH ? 0 : 8,
            icon: "",
          });
          setPairLoading(false);
        } catch (e: any) {
          setError(e.message);
          setPairLoading(false);
        }
      } else {
        try {
          let res = await new SwapContract(network).getReserve(
            tokenAHash,
            tokenBHash,
            connectedWallet
          );

          if (
            tokenAHash === NEO_SCRIPT_HASH ||
            tokenBHash === NEO_SCRIPT_HASH
          ) {
            const oppositeTokenHash =
              tokenAHash === NEO_SCRIPT_HASH ? tokenBHash : tokenAHash;
            const bNEORes = await new SwapContract(network).getReserve(
              tokenAHash === NEO_SCRIPT_HASH ? bNEOHash : tokenAHash,
              tokenBHash === NEO_SCRIPT_HASH ? bNEOHash : tokenBHash,
              connectedWallet
            );
            res.pair[NEO_SCRIPT_HASH].reserveAmount =
              bNEORes.pair[bNEOHash].reserveAmount;
            res.pair[oppositeTokenHash] = bNEORes.pair[oppositeTokenHash];
            res.totalShare = bNEORes.totalShare;
          }

          setData(res);
          setTokenA({
            hash: tokenAHash,
            symbol: res.pair[tokenAHash].symbol,
            decimals: res.pair[tokenAHash].decimals,
            icon: "",
          });
          setTokenB({
            hash: tokenBHash,
            symbol: res.pair[tokenBHash].symbol,
            decimals: res.pair[tokenBHash].decimals,
            icon: "",
          });
          setPairLoading(false);
        } catch (e: any) {
          setError(e.message);
          setPairLoading(false);
        }
      }
    }

    if (params.tokenA && params.tokenB) {
      load(params.tokenA, params.tokenB);
    }
  }, [
    location,
    refresh,
    params.tokenA,
    params.tokenB,
    connectedWallet,
    network,
    chain,
  ]);

  const noLiquidity =
    (tokenA &&
      tokenB &&
      data &&
      data.pair[tokenA.hash] &&
      data.pair[tokenA.hash].reserveAmount === 0) ||
    (tokenA &&
      tokenB &&
      data &&
      data.pair[tokenB.hash] &&
      data.pair[tokenB.hash].reserveAmount === 0);

  let priceImpact = 0;

  if (data && tokenB && tokenB && amountB && tokenA) {
    const reserve = u.BigInteger.fromNumber(
      data.pair[tokenB.hash].reserveAmount
    ).toDecimal(tokenB.decimals);

    priceImpact = (amountB / parseFloat(reserve)) * 100;

    console.log(
      tokenA.symbol + " reserve: " + data.pair[tokenA.hash].reserveAmount
    );
    console.log(
      tokenB.symbol + " reserve: " + data.pair[tokenB.hash].reserveAmount
    );
    console.log("Total shares: " + data.totalShare);
    console.log("Price impact: " + priceImpact.toString());
  }

  return (
    <div>
      <SwapNav
        rootPath={rootPath}
        search={
          tokenA &&
          tokenB &&
          !(
            tokenA.hash === NEO_SCRIPT_HASH &&
            tokenB.hash === BNEO_SCRIPT_HASH[network]
          ) &&
          !(
            tokenA.hash === BNEO_SCRIPT_HASH[network] &&
            tokenB.hash === NEO_SCRIPT_HASH
          )
            ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
            : undefined
        }
        onSettingClick={() => setSettingsActive(true)}
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

      {error && (
        <ErrorNotificationWithRefresh onRefresh={onRefresh} error={error} />
      )}

      <SwapInputs
        setSwapType={setSwapType}
        noLiquidity={noLiquidity}
        network={network}
        tokenA={tokenA}
        tokenB={tokenB}
        amountA={amountA}
        amountB={amountB}
        onAssetChange={onAssetChange}
        userTokenABalance={
          connectedWallet && tokenA && data
            ? data.userBalances[tokenA.hash]
            : undefined
        }
        userTokenBBalance={
          connectedWallet && tokenB && data
            ? data.userBalances[tokenB.hash]
            : undefined
        }
        onSwitch={onSwitch}
        setAmountA={setAmountA}
        setAmountB={setAmountB}
      />

      {tokenA && tokenB && amountA && amountB && slippage && !noLiquidity && (
        <SwapDetails
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={amountA}
          amountB={amountB}
          priceImpact={priceImpact}
          slippage={slippage}
          setSlippage={setSlippage}
        />
      )}

      <BNEOInfo
        network={network}
        tokenA={tokenA}
        tokenB={tokenB}
        amountB={amountB}
      />

      <hr />

      <SwapButton
        label="Swap"
        isLoading={isPairLoading}
        isActive={
          tokenA !== undefined &&
          amountA !== undefined &&
          data !== undefined &&
          data.userBalances &&
          data.userBalances[tokenA.hash] >= amountA
        }
        isWalletConnected={!!connectedWallet}
        onClick={connectedWallet ? onSwap : toggleWalletSidebar}
      />

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
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
        />
      )}

      <SwapSettings
        isActive={isSettingsActive}
        onClose={() => setSettingsActive(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
    </div>
  );
};

export default NEOSwap;

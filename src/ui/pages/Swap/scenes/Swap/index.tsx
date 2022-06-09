import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { toast } from "react-hot-toast";
import AssetListModal from "../../components/AssetListModal";
import {
  FaCaretDown,
  FaCaretUp,
  FaListAlt,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import { Link, useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { IReserveData } from "../../../../../packages/neo/contracts/ftw/swap/interfaces";
import NoLPInfo from "./components/NoLPInfo";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import SwapInputs from "./SwapInputs";
import Pools from "../Pools";
import {
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE,
} from "../../../../../consts";
import ReactTooltip from "react-tooltip";
import { useApp } from "../../../../../common/hooks/use-app";
import Providers from "../Providers";
import History from "../History";
import { GAS_SCRIPT_HASH } from "../../../../../packages/neo/consts";
import {
  DEFAULT_SLIPPAGE,
  PRICE_IMPACT_LIMIT,
} from "../../../../../packages/neo/contracts/ftw/swap/consts";
import PriceRatio from "./components/PriceRatio";
import HistoryButtons from "./components/HistoryButtons";
import { getAfterSlippage } from "../../../../../packages/neo/contracts/ftw/swap/helpers";
import SwapDetails from "./components/SwapDetails";
import { u } from "@cityofzion/neon-core";

export interface ITokenState {
  hash: string;
  decimals: number;
  symbol: string;
}

const Swap = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { network, connectedWallet } = useWallet();
  const { toggleWalletSidebar } = useApp();
  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | ""
  >("");
  const [isPoolListModalActive, setPoolListModalActive] = useState(false);
  const [isSwapHistoryModalActive, setSwapHistoryModalActive] = useState(false);
  const [isLPListModalActive, setLPListModalActive] = useState(false);

  // TODO: Save pair history in local storage (Temporary disabled)
  // const cachedTokenA = LocalStorage.getSwapTokenA();
  // const cachedTokenB = LocalStorage.getSwapTokenB();

  const [tokenA, setTokenA] = useState<ITokenState | undefined>({
    hash: GAS_SCRIPT_HASH,
    symbol: "GAS",
    decimals: 8,
  });
  const [tokenB, setTokenB] = useState<ITokenState | undefined>();
  const [amountA, setAmountA] = useState<number | undefined>();
  const [amountB, setAmountB] = useState<number | undefined>();
  const [data, setData] = useState<IReserveData | undefined>();
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

  const onAssetClick = (hash, symbol, decimals) => {
    const assetObj = {
      hash,
      symbol,
      decimals,
    };
    if (isAssetChangeModalActive === "A") {
      // LocalStorage.setSwapTokenA(hash);
      setTokenA(assetObj);
      if (tokenB) {
        let search = `?tokenA=${hash}&tokenB=${tokenB.hash}`;
        history.push(search);
      }
    } else {
      // LocalStorage.setSwapTokenB(assetHash);
      setTokenB(assetObj);
      if (tokenA) {
        let search = `?tokenA=${tokenA.hash}&tokenB=${hash}`;
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
        tokenB
      ) {
        try {
          const res = await new SwapContract(network).swap(
            connectedWallet,
            tokenA.hash,
            tokenA.decimals,
            amountA,
            tokenB.hash,
            tokenB.decimals,
            getAfterSlippage(amountB, slippage)
          );
          setTxid(res);
        } catch (e: any) {
          toast.error(e.description ? e.description : e.message);
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
      setAmountA(amountB);
      setAmountB(amountA);
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
      try {
        setError(undefined);
        setPairLoading(true);
        const res = await new SwapContract(network).getReserve(
          tokenAHash,
          tokenBHash,
          connectedWallet
        );
        setData(res);
        setTokenA({
          hash: tokenAHash,
          symbol: res.pair[tokenAHash].symbol,
          decimals: res.pair[tokenAHash].decimals,
        });
        setTokenB({
          hash: tokenBHash,
          symbol: res.pair[tokenBHash].symbol,
          decimals: res.pair[tokenBHash].decimals,
        });
        setPairLoading(false);
      } catch (e: any) {
        setError(e.message);
        setPairLoading(false);
      }
    }
    if (params.tokenA && params.tokenB) {
      load(params.tokenA, params.tokenB);
    }
  }, [location, refresh, params.tokenA, params.tokenB]);

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

  if (tokenA && tokenB && data && amountB) {
    const reserve = u.BigInteger.fromNumber(
      data.pair[tokenB.hash].reserveAmount
    ).toDecimal(tokenB.decimals);
    priceImpact = (amountB / parseFloat(reserve)) * 100;
    console.log(
      tokenA.symbol +
        " reserve: " +
        u.BigInteger.fromNumber(data.pair[tokenA.hash].reserveAmount).toDecimal(
          tokenA.decimals
        )
    );
    console.log(
      tokenB.symbol +
        " reserve: " +
        u.BigInteger.fromNumber(data.pair[tokenB.hash].reserveAmount).toDecimal(
          tokenB.decimals
        )
    );
    console.log("Price impact: " + priceImpact.toString());
  }

  const isTokenAMaxGas =
    tokenA &&
    tokenA.hash === GAS_SCRIPT_HASH &&
    data &&
    amountA &&
    data.userBalances[tokenA.hash] > 0 &&
    data.userBalances[tokenA.hash] <= amountA;

  const isTokenBMaxGas = false;

  return (
    <div>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title is-5 is-marginless ">Swap</h1>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="buttons">
              <div className="level-item">
                <Link
                  to={{
                    pathname: `${SWAP_PATH_LIQUIDITY_ADD}`,
                    search:
                      tokenA && tokenB
                        ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
                        : "",
                  }}
                  data-tip
                  data-for="addLiquidity"
                  className="button is-small is-white"
                >
                  <ReactTooltip
                    id="addLiquidity"
                    type="info"
                    effect="solid"
                    place="bottom"
                  >
                    <span>Add liquidity</span>
                  </ReactTooltip>
                  <FaPlus />
                </Link>
                <Link
                  to={SWAP_PATH_LIQUIDITY_REMOVE}
                  data-tip
                  data-for="removeLiquidity"
                  className="button is-small is-white"
                >
                  <ReactTooltip
                    id="removeLiquidity"
                    type="info"
                    effect="solid"
                    place="bottom"
                  >
                    <span>Remove liquidity</span>
                  </ReactTooltip>
                  <FaMinus />
                </Link>
              </div>
              <button
                onClick={() => setPoolListModalActive(true)}
                data-tip
                data-for="showPools"
                className="button is-small is-white"
              >
                <ReactTooltip
                  id="showPools"
                  type="info"
                  effect="solid"
                  place="bottom"
                >
                  <span>Show pools</span>
                </ReactTooltip>
                <FaListAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {noLiquidity && tokenA && tokenB ? (
        <NoLPInfo tokenA={tokenA.hash} tokenB={tokenB.hash} />
      ) : (
        <></>
      )}

      {error && (
        <ErrorNotificationWithRefresh onRefresh={onRefresh} error={error} />
      )}

      <SwapInputs
        isTokenAMaxGas={isTokenAMaxGas}
        isTokenBMaxGas={isTokenBMaxGas}
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

      {tokenA && tokenB && data && !noLiquidity ? (
        <>
          <hr />
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                {amountA && amountB ? (
                  <>
                    <button
                      onClick={() => setSwapDetailActive(!isSwapDetailActive)}
                      className={"button is-white is-small"}
                    >
                      {isSwapDetailActive ? <FaCaretUp /> : <FaCaretDown />}
                    </button>
                    <PriceRatio
                      symbolA={tokenA.symbol}
                      symbolB={tokenB.symbol}
                      amountA={amountA}
                      amountB={amountB}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <HistoryButtons
                  onSwapHistory={setSwapHistoryModalActive}
                  onLPHistory={setLPListModalActive}
                />
              </div>
            </div>
          </div>

          {tokenA &&
          tokenB &&
          data &&
          amountA &&
          amountB &&
          isSwapDetailActive ? (
            <SwapDetails
              symbolB={tokenB.symbol}
              decimalsB={tokenB.decimals}
              amountB={amountB}
              priceImpact={priceImpact}
              slippage={slippage ? slippage : 0}
              setSlippage={setSlippage}
            />
          ) : (
            <div></div>
          )}
        </>
      ) : (
        <></>
      )}

      <hr />

      <button
        disabled={
          isTokenAMaxGas ||
          isTokenBMaxGas ||
          !amountA ||
          !amountB ||
          (tokenA && data && data.userBalances[tokenA.hash] < amountA) ||
          priceImpact > PRICE_IMPACT_LIMIT
        }
        onClick={connectedWallet ? onSwap : toggleWalletSidebar}
        className={`button is-fullwidth is-primary ${
          priceImpact > PRICE_IMPACT_LIMIT ? "is-danger" : ""
        }`}
      >
        {connectedWallet
          ? priceImpact > PRICE_IMPACT_LIMIT
            ? "Price impact is too high"
            : "Swap"
          : "Connect wallet"}
      </button>

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
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive("")}
        />
      )}

      {isPoolListModalActive && (
        <Modal onClose={() => setPoolListModalActive(false)}>
          <Pools onPairClick={onPairClick} />
        </Modal>
      )}

      {tokenA && tokenB && isLPListModalActive ? (
        <Modal onClose={() => setLPListModalActive(false)}>
          <Providers
            tokenA={tokenA.hash}
            tokenB={tokenB.hash}
            totalShare={data && data.totalShare ? data.totalShare : undefined}
          />
        </Modal>
      ) : (
        <></>
      )}

      {tokenA && tokenB && isSwapHistoryModalActive ? (
        <Modal onClose={() => setSwapHistoryModalActive(false)}>
          <History tokenA={tokenA.hash} tokenB={tokenB.hash} />
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Swap;

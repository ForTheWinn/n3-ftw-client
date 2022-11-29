import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { toast } from "react-hot-toast";
import AssetListModal from "../../components/AssetListModal";
import _ from "underscore";
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
import {
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE,
} from "../../../../../consts";
import { useApp } from "../../../../../common/hooks/use-app";
import Providers from "../Providers";
import {
  DEFAULT_SLIPPAGE,
  PRICE_IMPACT_LIMIT,
} from "../../../../../packages/neo/contracts/ftw/swap/consts";
import PriceRatio from "./components/PriceRatio";
import HistoryButtons from "./components/HistoryButtons";
import {
  getAfterSlippage,
  getMaxTokenAAmount,
} from "../../../../../packages/neo/contracts/ftw/swap/helpers";
import SwapDetails from "./components/SwapDetails";
import { u } from "@cityofzion/neon-core";
import { handleError } from "../../../../../packages/neo/utils/errors";
import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
} from "../../../../../packages/neo/consts/nep17-list";
import Pairs from "../PairsFromServer";
import SwapHistory from "../../../Analytics/scenes/PairDetail/SwapHistory";
import { fakeNEOBNEOReserve } from "./helpers";
import { BNEOContract } from "../../../../../packages/neo/contracts/ftw/bneo";
import { toDecimal } from "../../../../../packages/neo/utils";

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
  const [tokenA, setTokenA] = useState<ITokenState | undefined>(
    _.isEmpty(params)
      ? {
          hash: GAS_SCRIPT_HASH,
          symbol: "GAS",
          decimals: 8,
        }
      : undefined
  );
  const [tokenB, setTokenB] = useState<ITokenState | undefined>();
  const [amountA, setAmountA] = useState<number | undefined>();
  const [amountB, setAmountB] = useState<number | undefined>();
  const [swapType, setSwapType] = useState<"AtoB" | "BtoA" | undefined>();
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
          });
          setTokenB({
            hash: tokenBHash,
            symbol: tokenBHash === NEO_SCRIPT_HASH ? "NEO" : "bNEO",
            decimals: tokenBHash === NEO_SCRIPT_HASH ? 0 : 8,
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
    }

    if (params.tokenA && params.tokenB) {
      load(params.tokenA, params.tokenB);
    }
  }, [location, refresh, params.tokenA, params.tokenB, connectedWallet]);

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
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title is-5 is-marginless ">Swap</h1>
          </div>
        </div>

        <div className="level-right is-hidden-mobile">
          <div className="level-item">
            <div className="buttons">
              <Link
                to={{
                  pathname: `${SWAP_PATH_LIQUIDITY_ADD}`,
                  search:
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
                      : "",
                }}
                className="button is-small is-white"
              >
                <span className="icon">
                  <FaPlus />
                </span>
                <span className="ml-1 is-hidden-mobile">Add Liquidity</span>
              </Link>

              <Link
                to={SWAP_PATH_LIQUIDITY_REMOVE}
                data-tip
                data-for="removeLiquidity"
                className="button is-small is-white"
              >
                <span className="icon">
                  <FaMinus />
                </span>
                <span className="ml-1 is-hidden-mobile">Withdraw</span>
              </Link>

              <button
                onClick={() => setPoolListModalActive(true)}
                className="button is-small is-white"
              >
                <span className="icon">
                  <FaListAlt />
                </span>
                <span className="ml-1 is-hidden-mobile">Pools</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs is-small is-hidden-tablet has-scroll-hide">
        <ul>
          <li>
            <Link
              to={{
                pathname: `${SWAP_PATH_LIQUIDITY_ADD}`,
                search:
                  tokenA && tokenB
                    ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
                    : "",
              }}
              className="button is-small is-white"
            >
              <span className="icon">
                <FaPlus />
              </span>
              <span className="ml-1">Add Liquidity</span>
            </Link>
          </li>
          <li>
            <Link
              to={SWAP_PATH_LIQUIDITY_REMOVE}
              className="button is-small is-white"
            >
              <span className="icon">
                <FaMinus />
              </span>
              <span className="ml-1">Withdraw</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => setPoolListModalActive(true)}
              className="button is-small is-white"
            >
              <span className="icon">
                <FaListAlt />
              </span>
              <span className="ml-1">Pools</span>
            </button>
          </li>
        </ul>
      </div>

      <hr className="is-hidden-mobile" />

      {noLiquidity && tokenA && tokenB ? (
        <NoLPInfo tokenA={tokenA.hash} tokenB={tokenB.hash} />
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

      {tokenA && tokenB && data && !noLiquidity ? (
        <>
          <hr />
          <div className="level is-mobile">
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

      {tokenA &&
        tokenA.hash === NEO_SCRIPT_HASH &&
        tokenB &&
        tokenB.hash === BNEO_SCRIPT_HASH[network] && (
          <div className="notification is-success is-light">
            We are converting using bNEO contract. It is not swapping through
            our swap contract.
            <br />
            <a
              className="is-size-7"
              target="_blank"
              href={"https://neoburger.io"}
            >
              [Learn more about bNEO]
            </a>
          </div>
        )}

      {tokenB && tokenB.hash === NEO_SCRIPT_HASH && (
        <div className="notification is-success is-light">
          NEO are indivisible. We are using bNEO behind the scene. You will be
          paying extra gas fee for converting.
          <br />
          <a
            className="is-size-7"
            target="_blank"
            href={"https://neoburger.io"}
          >
            [Learn more about bNEO]
          </a>
          {amountB ? (
            <>
              {" "}
              <br />
              <br />
              <span className="has-text-weight-bold">{`Extra fee: ${toDecimal(
                amountB * 100000
              )} GAS`}</span>
            </>
          ) : (
            ""
          )}
        </div>
      )}

      <hr />
      <button
        disabled={
          !amountA ||
          !amountB ||
          (tokenA && data && data.userBalances[tokenA.hash] < amountA) ||
          priceImpact > PRICE_IMPACT_LIMIT
        }
        onClick={connectedWallet ? onSwap : toggleWalletSidebar}
        className={`button is-fullwidth is-primary ${
          priceImpact > PRICE_IMPACT_LIMIT ? "is-danger" : ""
        } ${isPairLoading ? "is-loading" : ""}`}
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
          activeTokenInput={isAssetChangeModalActive}
          tokenAHash={tokenA ? tokenA.hash : undefined}
          tokenBHash={tokenB ? tokenB.hash : undefined}
          onAssetClick={onAssetClick}
          onClose={() => setAssetChangeModalActive("")}
          filterDecimals={true}
        />
      )}

      {isPoolListModalActive && (
        <Modal onClose={() => setPoolListModalActive(false)}>
          <Pairs onClick={onPairClick} />
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

      {tokenA && tokenB && isSwapHistoryModalActive && data ? (
        <Modal onClose={() => setSwapHistoryModalActive(false)}>
          <>
            <SwapHistory
              tokenA={"0x" + tokenA.hash}
              tokenB={"0x" + tokenB.hash}
              network={network}
              // Convert
              pairs={{
                ["0x" + tokenA.hash]: {
                  ...data.pair[tokenA.hash],
                },
                ["0x" + tokenB.hash]: {
                  ...data.pair[tokenB.hash],
                },
              }}
            />
            {/*<History tokenA={tokenA.hash} tokenB={tokenB.hash} />*/}
          </>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Swap;

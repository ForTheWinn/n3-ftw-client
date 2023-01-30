import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { toast } from "react-hot-toast";
import _ from "underscore";

import AssetListModal from "../../components/AssetListModal";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { IReserveData } from "../../../../../packages/neo/contracts/ftw/swap/interfaces";
import NoLPInfo from "./components/Notifications/NoLPInfo";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import SwapInputs from "./SwapInputs";
import Providers from "../Providers";
import { DEFAULT_SLIPPAGE } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import PriceRatio from "./components/PriceRatio";
import HistoryButtons from "./components/HistoryButtons";
import {
  getAfterSlippage,
  getMaxTokenAAmount,
} from "../../../../../packages/neo/contracts/ftw/swap/helpers";
import SwapDetails from "./components/Notifications/SwapDetails";
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
import AddLiquidityButton from "./components/SwapNav/AddLiquidityButton";
import RemoveLiquidityButton from "./components/SwapNav/RemoveLiquidityButton";
import BNEOInfo from "./components/Notifications/BNEOInfo";
import SwapButton from "./SwapButton";
import { useApp } from "../../../../../common/hooks/use-app";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../../../packages/chains/consts";
import { useWeb3React } from "@web3-react/core";

export interface ITokenState {
  hash: string;
  decimals: number;
  symbol: string;
}

interface ISwapProps {
  rootPath: string;
}
const Swap = ({ rootPath }: ISwapProps) => {
  const location = useLocation();
  const history = useHistory();
  const web3 = useWeb3React();
  const params = queryString.parse(location.search);
  const { chain } = useApp();
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
    async function loadNEO(tokenAHash, tokenBHash) {
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

    async function loadPolygon(tokenAHash, tokenBHash) {
       try {
         const res = await web3.connector.activate(80001);
         console.log(res);
         console.log(web3.connector);
         console.log(web3.provider);
       } catch (e) {
         console.log(e);
       }
    }

    if (params.tokenA && params.tokenB) {
      if (chain === NEO_CHAIN) {
        loadNEO(params.tokenA, params.tokenB);
      } else if (chain === POLYGON_CHAIN) {
        loadPolygon(params.tokenA, params.tokenB);
      }
    }
    loadPolygon(123,123);

  }, [
    location,
    refresh,
    params.tokenA,
    params.tokenB,
    connectedWallet,
    network,
    chain
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

  return (
    <div>
      <div className="level is-mobile">
        <div className="level-left is-hidden-mobile">
          <div className="level-item">
            <h1 className="title is-5 is-marginless ">Swap</h1>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <div className="buttons">
              <AddLiquidityButton
                network={network}
                rootPath={rootPath}
                tokenA={tokenA}
                tokenB={tokenB}
              />

              <RemoveLiquidityButton rootPath={rootPath} />

              {/* <PoolListButton onClick={setPoolListModalActive} /> */}
            </div>
          </div>
        </div>
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
        chain={chain}
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
              tokenA={tokenA}
              tokenB={tokenB}
              data={data}
              amountB={amountB}
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

      <BNEOInfo
        network={network}
        tokenA={tokenA}
        tokenB={tokenB}
        amountB={amountB}
      />

      <hr />

      <SwapButton
        data={data}
        tokenA={tokenA}
        amountA={amountA}
        amountB={amountB}
        isLoading={isPairLoading}
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

import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { SwapContract } from "../../../../../packages/neo/contracts";
import AssetListModal from "../../components/AssetListModal";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import { Link, useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { SWAP_PATH } from "../../../../../consts";
import moment from "moment";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import TimeLockInput from "./TimeLockInput";
import LPRewardInfo from "./LPRewardInfo";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPInputs from "./LPInputs";
import { IReserveData } from "../../../../../packages/neo/contracts/ftw/swap/interfaces";
import { FaAngleLeft } from "react-icons/fa";
import SettingDropdown from "./SettingDropdown";
import { DEFAULT_SLIPPAGE } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import PriceRatio from "../Swap/components/PriceRatio";
import { handleError } from "../../../../../packages/neo/utils/errors";

export interface ITokenState {
  hash: string;
  decimals: number;
  symbol: string;
}

const Liquidity = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { network, connectedWallet } = useWallet();
  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState<
    "A" | "B" | ""
  >("");

  const [tokenA, setTokenA] = useState<ITokenState | undefined>();
  const [tokenB, setTokenB] = useState<ITokenState | undefined>();
  const [amountA, setAmountA] = useState<number>();
  const [amountB, setAmountB] = useState<number>();
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [selectedLock, setSelectedLock] = useState(false);
  const [lockUntil, setUntil] = useState(new Date());
  const [data, setData] = useState<IReserveData | undefined>();
  const [isPairLoading, setPairLoading] = useState(false);
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState<string | undefined>();

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
      setTokenA(assetObj);
      if (tokenB) {
        let search = `?tokenA=${hash}&tokenB=${tokenB.hash}`;
        history.push(search);
      }
    } else {
      setTokenB(assetObj);
      if (tokenA) {
        let search = `?tokenA=${tokenA.hash}&tokenB=${hash}`;
        history.push(search);
      }
    }
    setAmountA(undefined);
    setAmountB(undefined);
    setAssetChangeModalActive("");
  };

  const onSuccess = () => {
    setTokenA(undefined);
    setTokenB(undefined);
    setRefresh(refresh + 1);
    setTxid("");
  };

  const onAddLiquidity = async () => {
    if (connectedWallet) {
      if (tokenA && tokenB && amountA && amountB && data) {
        try {
          const deadlineMs = selectedLock ? moment(lockUntil).valueOf() : 0;
          const res = await new SwapContract(network).provide(
            connectedWallet,
            tokenA.hash,
            tokenA.decimals,
            amountA,
            tokenB.hash,
            tokenB.decimals,
            amountB,
            deadlineMs,
            slippage * 100
          );
          setTxid(res);
        } catch (e: any) {
          toast.error(handleError(e));
        }
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const onSwitch = () => {
    if (tokenA || tokenB) {
      if (tokenA && tokenB) {
        let search = `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`;
        history.push(search);
      }
      setTokenB(tokenA);
      setTokenA(tokenB);
      setAmountB(amountA);
      setAmountA(amountB);
    }
  };

  const onRefresh = () => {
    setRefresh(refresh + 1);
  };

  const getReserve = async (tokenAHash, tokenBHash) => {
    try {
      setError(undefined);
      setPairLoading(true);
      const res = await new SwapContract(network).getReserve(
        tokenAHash,
        tokenBHash,
        connectedWallet
      );
      setData(res);
      if (!tokenA) {
        setTokenA({
          hash: tokenAHash,
          symbol: res.pair[tokenAHash].symbol,
          decimals: res.pair[tokenAHash].decimals,
        });
      }
      if (!tokenB) {
        setTokenB({
          hash: tokenBHash,
          symbol: res.pair[tokenBHash].symbol,
          decimals: res.pair[tokenBHash].decimals,
        });
      }
      setPairLoading(false);
    } catch (e: any) {
      setError(e.message);
      setPairLoading(false);
    }
  };

  useEffect(() => {
    async function load(A, B) {
      await getReserve(A, B);
    }
    if (params.tokenA && params.tokenB) {
      load(params.tokenA, params.tokenB);
    }
  }, [connectedWallet, refresh, params.tokenA, params.tokenB]);

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

  const toMain = {
    pathname: `${SWAP_PATH}`,
    search:
      tokenA && tokenB ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}` : "",
  };
  const title = noLiquidity ? "Create a new pool" : "Provide liquidity";
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "50px" }}>
          <Link className="button is-white is-small" to={toMain}>
            <span className="icon">
              <FaAngleLeft />
            </span>
            <span className="is-hidden-mobile">Main</span>
          </Link>
        </div>

        <h1 className="title is-5 is-marginless has-text-centered">{title}</h1>

        <div className="is-relative" style={{ width: "50px" }}>
          <div className="is-pulled-right">
            <SettingDropdown slippage={slippage} setSlippage={setSlippage} />
          </div>
        </div>
      </div>

      <hr />
      {noLiquidity && <LPRewardInfo />}
      {error && (
        <ErrorNotificationWithRefresh onRefresh={onRefresh} error={error} />
      )}
      <div className="is-relative">
        <LPInputs
          noLiquidity={noLiquidity}
          network={network}
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={amountA}
          amountB={amountB}
          onAssetChange={onAssetChange}
          onSwitch={onSwitch}
          setAmountA={setAmountA}
          setAmountB={setAmountB}
          data={data}
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
        />

        {connectedWallet ? (
          tokenA && tokenB && amountA && amountB ? (
            <>
              <hr />

              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <PriceRatio
                      symbolA={tokenA.symbol}
                      symbolB={tokenB.symbol}
                      amountA={amountA}
                      amountB={amountB}
                    />
                  </div>
                </div>

                <div className="level-right">
                  <div className="level-item">
                    <TimeLockInput
                      setLockUntil={setUntil}
                      lockUntil={lockUntil}
                      toggleSwitch={() => setSelectedLock(!selectedLock)}
                      isActive={selectedLock}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={
                  // isTokenAMaxGas ||
                  // isTokenBMaxGas ||
                  (tokenA &&
                    tokenB &&
                    data &&
                    data.userBalances[tokenA.hash] < amountA) ||
                  (tokenA &&
                    tokenB &&
                    data &&
                    data.userBalances[tokenB.hash] < amountB)
                }
                onClick={onAddLiquidity}
                className="button is-fullwidth is-primary"
              >
                Add Liquidity
              </button>
            </>
          ) : (
            <div />
          )
        ) : (
          <>
            <hr />
            <ConnectWalletButton className="is-primary is-fullwidth" />
          </>
        )}
      </div>

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
    </>
  );
};

export default Liquidity;

import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import { SwapContract } from "../../../packages/neo/contracts";
import { useWallet } from "../../../packages/provider";
import { RestAPI } from "../../../packages/neo/api";
import { u } from "@cityofzion/neon-core";
import { SpinnerRoundFilled } from "spinners-react";
import MyLPTokenList from "./MyLPTokenList";
import MyLPTokenCard from "./MyLPTokenCard";
import queryString from "query-string";
import {useHistory, useLocation} from "react-router-dom";

const LPTokens = () => {
  const location = useLocation();
	const history = useHistory();
  const params = queryString.parse(location.search);

  const { connectedWallet, network } = useWallet();

  const [prices, setPrices] = useState();
  const [id, setId] = useState<any>(params && params.id ? params.id : undefined);
  const [info, setInfo] = useState<any>();
  const [error, setError] = useState("");
  const [isSearching, setSearching] = useState(false);

  const handleSearch = async (id) => {
    try {
      setSearching(true);
      setError("");
      const info: any = await new SwapContract(network).getProperties(id);
      const reserve = await new SwapContract(network).getReserve(
        info.tokenA,
        info.tokenB
      );
      const tokenAPrice = prices ? prices["0x" + info.tokenA] : 0;
      const tokenBPrice = prices ? prices["0x" + info.tokenB] : 0;
      let tokenAReserve = reserve.pair[info.tokenA].reserveAmount;
      let tokenBReserve = reserve.pair[info.tokenB].reserveAmount;
      let tokenAAmount = parseFloat(
        u.BigInteger.fromNumber(tokenAReserve)
          .mul(info.amount)
          .div(reserve.totalShare)
          .toDecimal(reserve.pair[info.tokenA].decimals)
      );
      let tokenBAmount = parseFloat(
        u.BigInteger.fromNumber(tokenBReserve)
          .mul(info.amount)
          .div(reserve.totalShare)
          .toDecimal(reserve.pair[info.tokenB].decimals)
      );
      console.log(`Shares: ${info.amount}`);
      console.log(
        `${reserve.pair[info.tokenA].symbol}: ${tokenAAmount.toLocaleString()}`
      );
      console.log(
        `${reserve.pair[info.tokenB].symbol}: ${tokenBAmount.toLocaleString()}`
      );
      setInfo({
        tokenASymbol: reserve.pair[info.tokenA].symbol,
        tokenBSymbol: reserve.pair[info.tokenB].symbol,
        tokenAAmount,
        tokenBAmount,
        tokenAUSD: tokenAAmount * tokenAPrice,
        tokenBUSD: tokenBAmount * tokenBPrice,
      });
      setSearching(false);
	    let search = `?id=${id}`;
	    history.push(search);
    } catch (e: any) {
      setSearching(false);
      setError(e.message);
    }
  };

  useEffect(() => {
    async function getPrices() {
      const prices = await new RestAPI(network).getPrices();
      setPrices(prices);
    }
    getPrices();

    if (params.id) {
      handleSearch(params.id);
    }
  }, [network]);

  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title is-5">LP token calculator</h1>
            <p className="subtitle is-7">
              FTWSwap LP tokens are NFT. Enter LP token ID to find the token
              value.
            </p>
            <div className="field has-addons">
              <div className="control  is-expanded">
                <input
                  value={id}
                  onChange={(e: any) => setId(e.target.value)}
                  className="input"
                  type="text"
                  placeholder="Enter LP token ID"
                />
                {error ? <p className="help is-danger">{error}</p> : <></>}
              </div>
              <div className="control">
                <button
                  onClick={() => handleSearch(id)}
                  disabled={!id}
                  className={`button is-primary ${
                    isSearching ? "is-loading" : ""
                  }`}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {isSearching ? (
            <div className="box is-shadowless">
              <div className="level is-mobile">
                <div className="level-left">
                  <div className="level-item">
                    <SpinnerRoundFilled size={15} color="#ccc" />
                  </div>
                  <div className="level-item">Searching..</div>
                </div>
              </div>
            </div>
          ) : info && id ? (
            <div className="box is-shadowless">
              <MyLPTokenCard
                tokenId={id}
                tokenASymbol={info.tokenASymbol}
                tokenAAmount={info.tokenAAmount}
                tokenAUSD={info.tokenAUSD}
                tokenBSymbol={info.tokenBSymbol}
                tokenBAmount={info.tokenBAmount}
                tokenBUSD={info.tokenBUSD}
              />
            </div>
          ) : (
            <></>
          )}
          {connectedWallet && prices ? (
            <MyLPTokenList
              prices={prices}
              connectedWallet={connectedWallet}
              network={network}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default LPTokens;

import React, { useEffect, useState } from "react";
import SwapHistory from "./SwapHistory";
import { RestAPI } from "../../../../../packages/neo/api";
import LiquidityChart from "../Main/LiquidityChart";
import { MAINNET, UNKNOWN_TOKEN_IMAGE } from "../../../../../consts/global";
import { useApp } from "../../../../../common/hooks/use-app";
import { TOKEN_LIST } from "../../../../../consts/tokens";

interface IPairDetailProps {
  id: string;
}
const PairDetail = ({ id }: IPairDetailProps) => {
  const { chain, network } = useApp();
  const pairs = id.split("_");
  const tokenA = pairs[0];
  const tokenB = pairs[1];
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetch() {
      setError("");
      setLoading(true);
      try {
        const res = await new RestAPI(network).getPair(id);
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [network]);
  const tokenALogo = data
    ? TOKEN_LIST[chain][MAINNET][data.tokenA.id.substring(2)]
      ? TOKEN_LIST[chain][MAINNET][data.tokenA.id.substring(2)].icon
      : UNKNOWN_TOKEN_IMAGE
    : undefined;

  const tokenBLogo = data
    ? TOKEN_LIST[chain][MAINNET][data.tokenB.id.substring(2)]
      ? TOKEN_LIST[chain][MAINNET][data.tokenB.id.substring(2)].icon
      : UNKNOWN_TOKEN_IMAGE
    : undefined;
  return (
    <div>
      {data ? (
        <div>
          <div className="box is-shadowless">
            <div className="level is-mobile">
              <div className="level-left">
                {tokenALogo ? (
                  <div className="level-item">
                    <img width="45px" src={tokenALogo} alt="Token A" />
                  </div>
                ) : (
                  <></>
                )}
                <div className="level-item">
                  <h1 className="title is-5">{data.tokenA.symbol}</h1>{" "}
                </div>
                {tokenBLogo ? (
                  <div className="level-item">
                    <img width="45px" src={tokenBLogo} alt="Token B" />
                  </div>
                ) : (
                  <></>
                )}
                <div className="level-item">
                  <h1 className="title is-5">{data.tokenB.symbol}</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="columns is-multiline">
            <div className="column is-12">
              <div className="box is-shadowless">
                <h1 className="title is-6">Liquidity</h1>
                <LiquidityChart id={id} days="15" />
              </div>
            </div>
            <div className="column is-12">
              <div className="box is-shadowless">
                <h1 className="title is-6">Swap history</h1>
                <SwapHistory
                  tokenA={tokenA}
                  tokenB={tokenB}
                  network={network}
                  pairs={{
                    [data.tokenA.id]: {
                      ...data.tokenA
                    },
                    [data.tokenB.id]: {
                      ...data.tokenB
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default PairDetail;

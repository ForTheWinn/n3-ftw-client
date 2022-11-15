import React, { useEffect, useState } from "react";
import PageLayout from "../../../../components/PageLayout";
import SwapHistory from "./SwapHistory";
import { useWallet } from "../../../../../packages/provider";
import { RestAPI } from "../../../../../packages/neo/api";
import LiquidityChart from "../Main/LiquidityChart";
import { ASSET_LIST } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import {
  MAINNET,
  UNKNOWN_TOKEN_IMAGE,
} from "../../../../../packages/neo/consts";

interface IPairDetailProps {
  id: string;
}
const PairDetail = ({ id }: IPairDetailProps) => {
  const { network } = useWallet();
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
    ? ASSET_LIST[MAINNET][data.tokenA.id.substring(2)]
      ? ASSET_LIST[MAINNET][data.tokenA.id.substring(2)].logo
      : UNKNOWN_TOKEN_IMAGE
    : undefined;

  const tokenBLogo = data
    ? ASSET_LIST[MAINNET][data.tokenB.id.substring(2)]
      ? ASSET_LIST[MAINNET][data.tokenB.id.substring(2)].logo
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
                      ...data.tokenA,
                    },
                    [data.tokenB.id]: {
                      ...data.tokenB,
                    },
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
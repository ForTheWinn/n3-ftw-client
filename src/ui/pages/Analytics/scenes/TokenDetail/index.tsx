import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { RestAPI } from "../../../../../packages/neo/api";
import { ASSET_LIST } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import {
  MAINNET,
  UNKNOWN_TOKEN_IMAGE,
} from "../../../../../packages/neo/consts";
import TokenPriceChart from "../../components/PriceChart";
import LiquidityChart from "../Main/LiquidityChart";
import SwapHistory from "./SwapHistory";

interface ITokenDetailProps {
  tokenId: string;
}
const TokenDetail = ({ tokenId }: ITokenDetailProps) => {
  const { network } = useWallet();
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetch() {
      setError("");
      setLoading(true);
      try {
        const res = await new RestAPI(network).getToken(tokenId);
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [network]);
  if (!data) return <div></div>;
  const hash = tokenId.substring(2);
  const logo = ASSET_LIST[MAINNET][hash]
    ? ASSET_LIST[MAINNET][hash].icon
    : UNKNOWN_TOKEN_IMAGE;
  return (
    <div>
      <div className="box is-shadowless">
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <img width={"45px"} src={logo} alt={`${data.name} logo`} />
            </div>
            <div className="level-item">
              <h1 className="title is-5 is-marginless">{data.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="columns is-multiline">
        <div className="column is-6">
          <div className="box is-shadowless">
            <h1 className="title is-6">Liquidity</h1>
            <LiquidityChart id={tokenId} days="15" />
          </div>
        </div>
        <div className="column is-6">
          <div className="box is-shadowless">
            <h1 className="title is-6">Price</h1>
            <TokenPriceChart tokenId={tokenId} days="15" />
          </div>
        </div>
        <div className="column is-12">
          <div className="box is-shadowless">
            <h1 className="title is-6">Swap history</h1>
            <SwapHistory id={tokenId} network={network} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;

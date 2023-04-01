import React, { useEffect, useState } from "react";
import { RestAPI } from "../../../../../packages/neo/api";
import TokenPriceChart from "../../components/PriceChart";
import LiquidityChart from "../Main/LiquidityChart";
import SwapHistory from "./SwapHistory";
import { MAINNET, UNKNOWN_TOKEN_IMAGE } from "../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../consts/tokens";
import { useApp } from "../../../../../common/hooks/use-app";

interface ITokenDetailProps {
  tokenId: string;
}
const TokenDetail = ({ tokenId }: ITokenDetailProps) => {
  const { network, chain } = useApp();
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
  const logo = TOKEN_LIST[chain][MAINNET][hash]
    ? TOKEN_LIST[chain][MAINNET][hash].icon
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

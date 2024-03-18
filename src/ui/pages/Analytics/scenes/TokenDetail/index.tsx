import React from "react";
import LiquidityChart from "../NEOAnalytics/LiquidityChart";
import SwapHistory from "./SwapHistory";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../packages/neo/api";
import { CHAINS } from "../../../../../consts/chains";
import { MAINNET } from "../../../../../consts/global";

interface ITokenDetailProps {
  tokenId: string;
}
const TokenDetail = ({ tokenId }: ITokenDetailProps) => {
  const { data } = useOnChainData(() => {
    return new RestAPI(MAINNET).getToken(tokenId);
  }, []);

  if (!data) return <div></div>;

  return (
    <div>
      <div className="columns is-multiline">
        <div className="column is-6">
          <div className="box is-shadowless">
            <h1 className="title is-6">Liquidity</h1>
            <LiquidityChart id={tokenId} days="15" />
          </div>
        </div>
        {/* <div className="column is-6">
          <div className="box is-shadowless">
            <h1 className="title is-6">Price</h1>
            <TokenPriceChart tokenId={tokenId} days="15" />
          </div>
        </div> */}
        <div className="column is-12">
          <div className="box is-shadowless">
            <h1 className="title is-6">Swap history</h1>
            <SwapHistory id={tokenId} network={MAINNET} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;

import React, { useEffect, useState } from "react";
import { RestAPI } from "../../../../../packages/neo/api";
import TokenPriceChart from "../../components/PriceChart";
import LiquidityChart from "../Main/LiquidityChart";
import SwapHistory from "./SwapHistory";
import { MAINNET, UNKNOWN_TOKEN_IMAGE } from "../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../consts/tokens";
import { useApp } from "../../../../../common/hooks/use-app";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";

interface ITokenDetailProps {
  tokenId: string;
}
const TokenDetail = ({ tokenId }: ITokenDetailProps) => {
  const { network, chain } = useApp();

  const { data } = useOnChainData(() => {
    return new RestAPI(network).getToken(tokenId);
  }, [network]);

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

import React, { useEffect } from "react";
import ProductNotSupportedInNetwork from "../../../../components/ProductNotSupportedInNetwork";
import LiquidityChart from "./LiquidityChart";
import PageLayout from "../../../../components/Commons/PageLayout";
import Pools from "./Pairs";
import Tokens from "./Tokens";
import PriceChart from "../../components/PriceChart";
import { ANALYTICS_ROUTE } from "../../../../../consts/neoRoutes";
import { useApp } from "../../../../../common/hooks/use-app";
import { NEP_CONTRACT_HASH } from "../../../../../consts/contracts";

const AnalyticsMain = () => {
  const { chain, network } = useApp();

  useEffect(() => {
    document.title = "FTW Analytics";
  }, []);

  if (!ANALYTICS_ROUTE.network.includes(network)) {
    return (
      <ProductNotSupportedInNetwork title={"Analytics"} network={network} />
    );
  }

  return (
    <PageLayout>
      <div className="columns is-multiline">
        <div className="column is-6">
          <div className="box is-shadowless">
            <h1 className="title is-6">Liquidity</h1>
            <LiquidityChart id={"TOTAL"} days={"20"} />
          </div>
        </div>
        <div className="column is-6">
          <div className="box is-shadowless">
            <h1 className="title is-6">NEP</h1>
            <PriceChart
              tokenId={NEP_CONTRACT_HASH[chain][network]}
              days={"10"}
            />
          </div>
        </div>
        <div className="column is-6">
          <div
            className="box is-shadowless has-scroll-hide"
            style={{
              height: "600px",
              width: "100%",
              overflowY: "scroll"
            }}
          >
            <h1 className="title is-6">Tokens</h1>
            <Tokens />
          </div>
        </div>
        <div className="column is-6">
          <div
            className="box is-shadowless has-scroll-hide"
            style={{
              height: "600px",
              width: "100%",
              overflowY: "scroll"
            }}
          >
            <h1 className="title is-6">Pairs</h1>
            <Pools />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AnalyticsMain;

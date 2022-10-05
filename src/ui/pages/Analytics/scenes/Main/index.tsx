import React, { useEffect } from "react";
import { ANALYTICS_ROUTE } from "../../../../../consts";
import { useWallet } from "../../../../../packages/provider";
import ProductNotSupportedInNetwork from "../../../../components/ProductNotSupportedInNetwork";
import LiquidityChart from "./LiquidityChart";
import PageLayout from "../../../../components/PageLayout";
import Pools from "./Pairs";
import Tokens from "./Tokens";
import PriceChart from "../../components/PriceChart";
import { NEP_SCRIPT_HASH } from "../../../../../packages/neo/consts/nep17-list";

const AnalyticsMain = () => {
  const { network } = useWallet();

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
            <PriceChart tokenId={"0x" + NEP_SCRIPT_HASH[network]} days={"10"} />
          </div>
        </div>
        <div className="column is-6">
          <div
            className="box is-shadowless has-scroll-hide"
            style={{
              height: "600px",
              width: "100%",
              overflowY: "scroll",
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
              overflowY: "scroll",
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

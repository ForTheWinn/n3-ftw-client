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
  if (!ANALYTICS_ROUTE.network.includes(network)) {
    return (
      <ProductNotSupportedInNetwork title={"Analytics"} network={network} />
    );
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    document.title = "FTW Analytics";
  }, []);
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
            <PriceChart tokenId={"0x" + NEP_SCRIPT_HASH[network]} days={"20"} />
          </div>
        </div>
        <div className="column is-6">
          <div className="box is-shadowless">
            <h1
              className="title is-6"
              // style={{ padding: "1.25rem", paddingBottom: "0" }}
            >
              Tokens
            </h1>
            <div
              style={{
                height: "600px",
                width: "100%",
	              overflowY: "scroll"
                //overflow: "hidden",
              }}
            >
              {/*<div style={{ padding: "1.25rem", paddingTop: "0", height: "100%", width:"100%", overflow:"auto" ,paddingRight: "20px" }}>*/}
              <Tokens />
              {/*</div>*/}
            </div>
          </div>
        </div>
        <div className="column is-6">
          <div className="box is-shadowless">
            <h1 className="title is-6">Pairs</h1>
            <div
              style={{
                height: "600px",
                width: "100%",
                overflowY: "scroll"
              }}
            >
              {/*<div style={{ padding: "1.25rem", paddingTop: "0", height: "100%", width:"100%", overflow:"auto" ,paddingRight: "20px" }}>*/}
              <Pools />
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AnalyticsMain;

import React, { useEffect } from "react";
import LiquidityChart from "./LiquidityChart";
import Pools from "./Pairs";
import Tokens from "./Tokens";
import PriceChart from "../../components/PriceChart";
import { useApp } from "../../../../../common/hooks/use-app";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";
import { NEO_CHAIN } from "../../../../../consts/global";

const AnalyticsMain = () => {
  const { network } = useApp();

  useEffect(() => {
    document.title = "FTW Analytics";
  }, []);

  return (
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
            tokenId={GLOBAL_NEP_CONTRACT_ADDRESS[NEO_CHAIN][network]}
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
            overflowY: "scroll",
          }}
        >
          <h1 className="title is-6">Tokens</h1>
          <Tokens chain={NEO_CHAIN} network={network} />
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
          <Pools chain={NEO_CHAIN} network={network} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMain;

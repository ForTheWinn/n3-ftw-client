import React, { useEffect } from "react";
import { useApp } from "../../../../../common/hooks/use-app";
import { MAINNET, NEO_CHAIN } from "../../../../../consts/global";
import Pairs from "../../components/Pairs";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../packages/neo/api";

const AnalyticsMain = () => {
  const { network } = useApp();

  useEffect(() => {
    document.title = "FTW Analytics";
  }, []);

  const payload = useOnChainData(() => {
    return new RestAPI(MAINNET).getNEOPairs();
  }, []);

  return (
    <>
      <Pairs chain={NEO_CHAIN} {...payload} />
      {/* <div className="columns is-multiline">
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
      </div> */}
    </>
  );
};

export default AnalyticsMain;

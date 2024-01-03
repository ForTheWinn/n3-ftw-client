import React from "react";
import { MAINNET, POLYGON_CHAIN } from "../../../../../../consts/global";
import Pairs from "../../../components/Pairs";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../packages/neo/api";

const PolygonAnalytics = () => {
  const payload = useOnChainData(() => {
    return new RestAPI(MAINNET).getEVMSwapPairs({ chain: POLYGON_CHAIN });
  }, []);
  return (
    <>
      <Pairs chain={POLYGON_CHAIN} {...payload} />
    </>
  );
};

export default PolygonAnalytics;

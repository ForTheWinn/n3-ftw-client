import React from "react";
import { MAINNET, NEOX_CHAIN, POLYGON_CHAIN } from "../../../../../../consts/global";
import Pairs from "../../../components/Pairs";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../packages/neo/api";

const NeoXAnalytics = () => {
  const payload = useOnChainData(() => {
    return new RestAPI(MAINNET).getEVMSwapPairs({ chain: NEOX_CHAIN });
  }, []);
  return (
    <>
      <Pairs chain={NEOX_CHAIN} {...payload} />
    </>
  );
};

export default NeoXAnalytics;
